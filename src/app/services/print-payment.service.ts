import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
const { Filesystem } = Plugins;

import * as JsBarcode from 'jsbarcode';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { AuthenticationService } from './authentication.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintPaymentService {

  storageUrl = environment.StorageUrl;
  apiUrl = environment.apiLink;

  pdfObj = null;
  logoData = null;
  dataArray: any;

  newContent = [];

  isLoading = false;
  constructor(
    private plt: Platform,
    private fileOpener: FileOpener,
    private http: HttpClient,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  changeFont(data) {
    this.present();
    this.newContent = [];
    if (Array.isArray(data)) {
      this.dataArray = data;
    } else {
      this.dataArray = [{ ...data }];
    }
    pdfMake.fonts = {
      arial: {
        normal: 'arial.ttf',
        bold: 'arial_bold.ttf',
        italics: 'arial.ttf',
        bolditalics: 'arial_bold.ttf'
      }
    }

    this.createPdf();
  }

  table(data) {
    return {
      table: {
        headerRows: 1,
        widths: '*',
        body: this.buildTableBody(data)
      }
    };
  }

  buildTableBody(data) {
    var body = [];

    body.push([
      { text: this.reverseArabic('المبلغ'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('التوصيل'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('الإجمالي'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('المستلم'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('التاريخ'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('الرقم'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
    ]);

    data.forEach(function (row) {
      let endCustomerName: String = row.end_customer_name;
      if (endCustomerName) {
        var position = endCustomerName.search(/[\u0600-\u06FF]/);
        if (position >= 0) {
          endCustomerName = endCustomerName.split(' ').reverse().join('  ');
        }
      }

      body.push([
        { text: (row.order_costs[0].who_pays == 1 ? row.order_costs[0].packages_cost - row.order_costs[0].trans_cost : row.order_costs[0].packages_cost), alignment: "center" }, //hani
        { text: (row.order_costs[0].trans_cost), alignment: "center" },
        { text: (row.order_costs[0].to_collect), alignment: "center" },
        { text: (endCustomerName), alignment: "center" },
        { text: new Date(row.created_at).toLocaleDateString('en-GB'), alignment: "center" },
        { text: (row.oid), alignment: "center" }
      ]
      );
    });

    body.push([
      { 
        text: data.reduce((acc, obj) => acc + (obj.order_costs[0].who_pays == 1 ? obj.order_costs[0].packages_cost - obj.order_costs[0].trans_cost : obj.order_costs[0].packages_cost), 0), 
        alignment: "center", 
        style: "tableheader" },
      { text: this.reverseArabic('الإجمالي'), colSpan: 4, alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
      { text: this.reverseArabic('العدد: ' + data.length), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
    ]);

    return body;
  }

  async createPdf() {
    // let logoImage: any;
    // await this.getBase64ImageFromUrl2('http://approvaltests.com/images/logo.png')
    // .then(result => logoImage = result)
    // .catch(err => console.error(err));
    this.dataArray.forEach((element, index) => {
      let barcode = { image: this.textToBase64Barcode(element.oid), width: 200 };
      this.newContent.push(
        // Customer
        {
          columns: [
            { image: this.textToBase64Barcode(element.oid), width: 200, style: "margin_top" },
            {
              layout: 'noBorders', // optional
              table: {
                headerRows: 0,
                widths: ['70%', '30%'],
                body: [
                  [
                    { text: this.reverseArabic(element.customer.name), alignment: "right", style: "margin_top" },
                    { text: this.reverseArabic('اسم المورد:'), alignment: "right", style: "margin_top" },
                  ],
                  [
                    { text: this.reverseArabic(element.customer.city.name + ' - ' + element.customer.address), alignment: "right" },
                    { text: this.reverseArabic('عنوان المورد:'), alignment: "right" }
                  ],
                  [
                    { text: this.reverseArabic(element.customer.phone), alignment: "right" },
                    { text: this.reverseArabic('رقم الهاتف:'), alignment: "right" }
                  ],
                  [
                    { text: element.oid, alignment: "right" },
                    { width: 100, text: this.reverseArabic('رقم سند الصرف:'), alignment: "right" }
                  ],
                  [
                    { text: new Date(element.created_at).toLocaleDateString('en-GB'), alignment: "right" },
                    { width: 100, text: this.reverseArabic('تاريخ سند الصرف:'), alignment: "right" }
                  ],
                  [
                    { text: element.total, alignment: "right" },
                    { width: 100, text: this.reverseArabic('إجمالي سند الصرف:'), alignment: "right" }
                  ],
                ]
              }
            }
          ]
        }
      );

      this.newContent.push(
        // table first Header
        {
          // layout: 'noBorders', // optional
          style: "margin_top",
          table: {
            headerRows: 0,
            widths: ['*'],
            body: [
              [
                { text: this.reverseArabic('الطلبيات المسددة'), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
              ]
            ]
          }
        },
      );

      // Orders details
      this.newContent.push(
        this.table(element.orders)
      );

      // Signatures
      this.newContent.push(
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 0,
            widths: ['35%', '15%', '35%', '15%'],
            body: [
              [
                { text: this.reverseArabic(element.customer.name), alignment: "right", style: "margin_top_40" },
                { text: this.reverseArabic('اسم المورد:'), alignment: "right", style: "margin_top_40" },
                { text: this.reverseArabic(element.company.name), alignment: "right", style: "margin_top_40" },
                { text: this.reverseArabic('اسم الشركة:'), alignment: "right", style: "margin_top_40" },
              ],
              [
                { text: '________________', alignment: "right", style: "margin_top" },
                { text: this.reverseArabic('توقيع المورد:'), alignment: "right", style: "margin_top" },
                { text: '________________', alignment: "right", style: "margin_top" },
                { text: this.reverseArabic('توقيع الشركة:'), alignment: "right", style: "margin_top" },
              ]
            ]
          }
        }
      );

      // Footer

      if ((index + 1) != this.dataArray.length) {
        this.newContent.push(
          { text: '', pageBreak: 'after' }
        );
      }

    });
    
    let logo = { image: await this.getBase64ImageFromURL(this.apiUrl + '/getImage/' + this.authService.companyId()), fit: [70, 70], style: 'header' };

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 100, 20, 70],
      header: [
        // Header
        {
          columns: [
            logo,
            [
              { text: this.reverseArabic(this.dataArray[0].company.name), alignment: "right", style: 'headerName' },
              { text: this.reverseArabic(this.dataArray[0].company.city.name + ' - ' + this.dataArray[0].company.address), alignment: "right", style: 'headerText' },
              { text: this.reverseArabic(this.dataArray[0].company.phone), alignment: "right", style: 'headerText' }
            ]
          ]
        },
        //Line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }], style: 'header' }
      ],
      footer: function (currentPage, pageCount) {
        let pageCountText: String = 'صفحة ' + currentPage.toString() + '  من ' + pageCount;
        if (pageCountText) {
          var position = pageCountText.search(/[\u0600-\u06FF]/);
          if (position >= 0) {
            pageCountText = pageCountText.split(' ').reverse().join('  ');
          }
        }
        return [
          //Line
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }], style: 'header' },
          {
            table: {
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: new Date().toLocaleDateString('en-GB'), alignment: "left", margin: [20, 5, 0, 0] },
                  { text: 'Developed by act.ps', alignment: "center", margin: [0, 5, 0, 0] },
                  { text: pageCountText, alignment: 'right', margin: [0, 5, 20, 0] }, //, style: 'normalText'
                ]
              ]
            },
            layout: 'noBorders'
          }
        ];
      },
      content: [
        this.newContent
      ],
      styles: {
        header: {
          margin: [20, 10, 20, 0]
        },
        headerName: {
          fontSize: 14,
          bold: true,
          margin: [20, 15, 20, 0]
        },
        headerText: {
          margin: [0, 5, 20, 0]
        },
        tableheader: {
          fontSize: 14,
          bold: true
        },
        margin_top: {
          margin: [0, 10, 0, 0]
        },
        margin_top_40: {
          margin: [0, 40, 0, 0]
        },
        bold: {
          bold: true
        },
        act: {
          margin: [0, 10, 0, 0],
          fontSize: 8
        }
      },
      defaultStyle: {
        font: 'arial'
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `order_act.pdf`;
          const result = await Filesystem.writeFile({
            path: path,
            data: data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          this.fileOpener.open(result.uri, 'application/pdf')
            .then(() => this.dismiss())
            .catch(e => {
              this.dismiss();
              console.log('Error opening file');
            });
        } catch (e) {
          this.dismiss();
          console.log('Unable to write file');
        }
      });
    } else {
      this.pdfObj.download();
      this.dismiss();
    }
  }

  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE39" });
    return canvas.toDataURL("image/png");
  }

  async getBase64ImageFromUrl2(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  getBase64ImageBarcode(text) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        JsBarcode(canvas, text, { format: "CODE39" });
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src;
    });
  }

  private reverseArabic(text: string) {
    if (text) {
      var position = text.search(/[\u0600-\u06FF]/);
      if (position >= 0) {
        return text.split(' ').reverse().join('  ');
      } else {
        return text;
      }
    } else {
      return text;
    }
  }

  payOnDelivery(element) {
    if (element.order_costs[0].pay_on_delivery == 1) {
      return 'الدفع عند التسليم: نعم';
    }
    return 'الدفع عند التسليم: لا';
  }

  whoPay(element) {
    if (element.order_costs[0].who_pays == 1) {
      return "التوصيل على المرسل";
    } else if (element.order_costs[0].who_pays == 2) {
      return "التوصيل على المستلم";
    } else if (element.order_costs[0].who_pays == 3) {
      return "توصيل مجاني";
    }
    return '';
  }

  loadLocalAssetToBase64() {
    this.http.get('/assets/actLogo.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result;
        }
        reader.readAsDataURL(res);
      });
  }


}
