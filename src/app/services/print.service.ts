import { Injectable } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
const { Filesystem } = Plugins;

import * as JsBarcode from 'jsbarcode';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  pdfObj = null;
  logoData = null;
  dataArray: any;

  newContent = [];

  constructor(
    private plt: Platform,
    private fileOpener: FileOpener
  ) { }

  changeFont(data) {
    this.newContent = [];
    if (Array.isArray(data)) {
      this.dataArray = data;
    } else {
      this.dataArray = [{...data}];
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


  createPdf() {
    let logo = { image: this.logoData, width: 50 };
    // const barcode = { image: this.textToBase64Barcode(this.data.oid), width: 200 };
    this.dataArray.forEach((element, index) => {
      let barcode = { image: this.textToBase64Barcode(element.oid), width: 200 };
      this.newContent.push(
        {
          columns: [
            { image: this.textToBase64Barcode(element.oid), width: 200 },
            {
              text: this.reverseArabic(element.company.name) 
              + '\n'
              + '\n' + '852379619',
              alignment: "right",
              style: 'header'
            }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            new Date(element.due_date).toLocaleDateString(),
            {
              columns: [
                { text: element.oid, alignment: "right", style: "bold" },
                { text: this.reverseArabic('طلبية رقم'), alignment: "right" },
              ]
            }
          ], style: 'margin_top'
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            { width: '40%', text: 'إلى', style: 'header', alignment: "right" },
            { width: '40%', text: 'من', style: 'header', alignment: "right" },
            { width: '20%', text: '', style: 'header', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '40%', text: this.reverseArabic(element.end_customer_name), alignment: "right" },
            { width: '40%', text: this.reverseArabic(element.customer.name), alignment: "right" },
            { width: '20%', text: 'الاسم', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '40%', text: this.reverseArabic(element.to.name), alignment: "right" },
            { width: '40%', text: this.reverseArabic(element.from.name), alignment: "right" },
            { width: '20%', text: 'المدينة', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '40%', text: this.reverseArabic(element.end_customer_address), alignment: "right" },
            { width: '40%', text: this.reverseArabic(element.customer.address), alignment: "right" },
            { width: '20%', text: 'العنوان', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '40%', text: element.end_customer_phone, alignment: "right" },
            { width: '40%', text: element.customer.phone, alignment: "right" },
            { width: '20%', text: 'الهاتف', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '80%', text: this.reverseArabic(element.notes), alignment: "right" },
            { width: '20%', text: 'ملاحظة', style: 'margin_top', alignment: "right" }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            // { width: '30%', qr: element.oid, fit: '100' },
            // {image : this.textToBase64Barcode(element.oid)},

            {
              columns: [
                {
                  width: '30%',
                  text: ""
                    + '\n' + this.reverseArabic(this.payOnDelivery(element))
                    + '\n' + this.reverseArabic(this.whoPay(element)),
                  alignment: "right"
                },
                {
                  width: '70%',
                  text: element.order_costs[0].packages_count + ' : ' + this.reverseArabic(' عدد الطرود ')
                    // + '\n' + element.order_costs[0].packages_cost + ' : ' + this.reverseArabic(' تكلفة الطرود ')
                    // + '\n' + element.order_costs[0].trans_cost + ' : ' + this.reverseArabic(' تكلفة الشحن ')
                    + '\n' + element.order_costs[0].to_collect + ' : ' + this.reverseArabic(' مبلغ التحصيل '),
                  alignment: "right"
                }
              ]
            }
          ], style: 'margin_top'
        }
      );

      if ((index + 1) != this.dataArray.length) {
        this.newContent.push(
          { text: '', pageBreak: 'after' }
        );
      }

    });
    let docDefinition = {
      pageSize: 'A5',
      pageOrientation: 'landscape',
      pageMargins: [20, 30, 20, 70],
      footer: [
        { text: this.reverseArabic('ملاحظة: شركة التوصيل غير مسؤولة عن طبيعة محتويات الطرود'), alignment: "center", margin: [0, 5, 0, 0] },
        { text: 'Developed by act.ps', alignment: "center", margin: [0, 10, 0, 0] }
      ],
      content: [
        this.newContent
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 0]
        },
        margin_top: {
          margin: [0, 10, 0, 0]
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
            .then(() => console.log('done'))
            .catch(e => console.log('Error opening file'));
        } catch (e) {
          console.log('Unable to write file');
        }
      });
    } else {
      this.pdfObj.download();
    }
  }

  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE39" });
    return canvas.toDataURL("image/png");
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
    });}

  private reverseArabic(text: string) {
    if (text ) {
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
}
