import { Injectable } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
const { Filesystem } = Plugins;

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class TemplateReportService {

  storageUrl = environment.StorageUrl;
  apiUrl = environment.apiLink;

  pdfObj = null;
  logoData = null;

  dataArray: any;
  reportFilter: any;
  reportTitle: any;
  headerData: any;
  groupBy: any;
  groupByTitle: any;
  colmuns: any;
  pageOrientation: String;
  accumulate: any;
  newContent = [];

  isLoading = false;
  constructor(
    private plt: Platform,
    private fileOpener: FileOpener,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) { }

  async startReport(reportFilter, reportTitle, headerData, groupBy, groupByTitle, colmuns, data, pageOrientation, accumulate) {
    this.reportFilter = reportFilter;
    this.reportTitle = reportTitle;
    this.headerData = headerData;
    this.groupBy = groupBy;
    this.groupByTitle = groupByTitle;
    this.colmuns = colmuns;
    this.pageOrientation = pageOrientation;
    this.accumulate = accumulate;
    this.present();
    this.newContent = [];
    if (Array.isArray(data)) {
      this.dataArray = data;
    } else {
      this.dataArray = [{ ...data }];
    }

    await this.changeFont();

    this.newContent = await this.createContent();

    let docDefinition = await this.createDocDefinition();

    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.downloadPdf();
  }

  // ------------------- details

  changeFont() {
    pdfMake.fonts = {
      arial: {
        normal: 'arial.ttf',
        bold: 'arial_bold.ttf',
        italics: 'arial.ttf',
        bolditalics: 'arial_bold.ttf'
      }
    }
  }

  async createContent() {
    let tempContent = [];

    tempContent.push(
      { text: this.reverseArabic(this.reportTitle), alignment: "center", style: 'reportTitle' }
    );

    // tempContent.push(
    //   { text: this.reverseArabic(this.reportFilter), alignment: "center", style: 'reportTitle' }
    // );
    // tempContent.push(
    //   await this.table(this.dataArray)
    // );

    this.dataArray.forEach(async (element, index) => {

      // Orders details
      tempContent.push(
        await this.table(element)
      );

      // new table
      if ((index + 1) != this.dataArray.length) {
        tempContent.push(
          { text: '', style: "margin_top_20" }
        );
      }

      // new page
      // if ((index + 1) != this.dataArray.length) {
      //   tempContent.push(
      //     { text: '', pageBreak: 'after' }
      //   );
      // }

    });

    return tempContent;
  }

  async table(data) {
    return {
      table: {
        headerRows: 2,
        widths: '*',
        margin: [0, 15, 0, 0],
        body: await this.buildTableBody(data)
      }
    };
  }

  async buildTableBody(data) {
    var body = [];

    let tableTitle = [];
    tableTitle.push(
      { text: this.reverseArabic(this.groupByTitle + data[0][this.groupBy].name), colSpan: (this.colmuns.length), alignment: "right", style: "tableheader", fillColor: '#f1f1f1' }
    );
    for (let index = 0; index < (this.colmuns.length - 1); index++) {
      tableTitle.push(
        { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
      );
    }
    body.push(tableTitle);

    let tableHeader = [];
    await this.colmuns.forEach(async element => {
      tableHeader.push(
        { text: this.reverseArabic(element.arabicTitle), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
      );
    });

    body.push(tableHeader);

    await data.forEach(async row => {
      let tableData = [];
      await this.colmuns.forEach(async element => {
        let propertyData: any = null;
        if (element.hasSub) {
          let subRow = row[element.subProperty];
          if (Array.isArray(subRow)) {
            subRow = subRow[0];
          }
          propertyData = subRow[element.propertyName]
        } else {
          propertyData = row[element.propertyName]
        }
        if (element.type === 'string') {
          tableData.push(
            { text: this.reverseArabic(propertyData), alignment: "center" }
          );
        } else if (element.type === 'date') {
          tableData.push(
            { text: new Date(propertyData).toLocaleDateString('en-GB'), alignment: "center" }
          );
        } else {
          tableData.push(
            { text: propertyData, alignment: "center" }
          );
        }

      });

      body.push(tableData);
    });

    let tableFooter = [];
    tableFooter.push(
      { text: data.reduce((acc, obj) => acc + obj.order_costs[0][this.accumulate], 0), alignment: "center", style: "tableheader" }
    );
    tableFooter.push(
      { text: this.reverseArabic('الإجمالي'), colSpan: (this.colmuns.length - 2), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
    );
    for (let index = 0; index < (this.colmuns.length - 3); index++) {
      tableFooter.push(
        { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
      );
    }
    tableFooter.push(
      { text: this.reverseArabic('العدد: ' + data.length), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
    );
    body.push(tableFooter);


    // await body.push([
    //   { text: data.reduce((acc, obj) => acc + obj.order_costs[0].packages_cost, 0), alignment: "center", style: "tableheader" },
    //   { text: this.reverseArabic('الإجمالي'), colSpan: 2, alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
    //   { text: '', alignment: "center", style: "tableheader", fillColor: '#f1f1f1' },
    //   { text: this.reverseArabic('العدد: ' + data.length), alignment: "center", style: "tableheader", fillColor: '#f1f1f1' }
    // ]);

    return body;
  }

  async createDocDefinition() {
    let x2 = 557;
    if (this.pageOrientation === 'landscape') x2 = 804;
    let logo = { image: await this.getBase64ImageFromURL(this.apiUrl + '/getImage/' + this.authService.companyId()), fit: [70, 70], style: 'header' };
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: this.pageOrientation, // 'landscape', 'portrait'
      pageMargins: [20, 100, 20, 70],
      header: [
        // Header
        {
          columns: [
            logo,
            [
              { text: this.reverseArabic(this.headerData.name), alignment: "right", style: 'headerName' },
              { text: this.reverseArabic(this.headerData.city.name + ' - ' + this.headerData.address), alignment: "right", style: 'headerText' },
              { text: this.reverseArabic(this.headerData.phone), alignment: "right", style: 'headerText' }
            ]
          ]
        },
        //Line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: x2, y2: 5, lineWidth: 1 }], style: 'header' }
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
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: x2, y2: 5, lineWidth: 1 }], style: 'header' },
          {
            table: {
              widths: '*',
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
        reportTitle: {
          fontSize: 14,
          bold: true,
          margin: [20, 2, 20, 10]
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
        margin_top_20: {
          margin: [0, 20, 0, 0]
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

    return docDefinition;
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

}
