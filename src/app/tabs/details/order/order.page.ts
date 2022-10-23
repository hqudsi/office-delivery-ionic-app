import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { AddPaymentModalPage } from 'src/app/modals/add-payment-modal/add-payment-modal.page';
import { ChangeStatusModalPage } from 'src/app/modals/change-status-modal/change-status-modal.page';
import { StatusPopoverComponent } from 'src/app/popovers/status-popover/status-popover.component';
import { PackgesPopoverComponent } from 'src/app/popovers/packges-popover/packges-popover.component';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';

import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ShowQrPopoverComponent } from 'src/app/popovers/show-qr-popover/show-qr-popover.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { CallNumber } from '@ionic-native/call-number/ngx';
import * as JsBarcode from 'jsbarcode';
import { EditOrderModalPage } from 'src/app/modals/edit-order-modal/edit-order-modal.page';
import { EditDriverModalPage } from 'src/app/modals/edit-driver-modal/edit-driver-modal.page';
import { PrintService } from 'src/app/services/print.service';
import { ChangeTransCostModalPage } from 'src/app/modals/change-trans-cost-modal/change-trans-cost-modal.page';
import { ChangeWhoPayModalPage } from 'src/app/modals/change-who-pay-modal/change-who-pay-modal.page';
import { DataService } from 'src/app/services/data/data.service';

// import { JsBarcode } from 'jsbarcode/bin/JsBarcode';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  data: any;
  statuses: any;
  systemStatuses: any;
  cities: any;
  drivers: any;

  pdfObj = null;
  logoData = null;

  userType: any;
  filterData: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private http: HttpClient,
    private fileOpener: FileOpener,
    private plt: Platform,
    private callNumber: CallNumber,
    private printService: PrintService,
    private dataService: DataService
  ) {
    this.userType = authService.user.type;
  }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.data = this.route.snapshot.data['data'].order;
      this.filterData = this.route.snapshot.data['data'].filterData;
      this.loadStatuses();
      this.loadLocalAssetToBase64();
      this.loadOtherData();
    } else {
      this.router.navigateByUrl('/tabs/orders', { replaceUrl: true });
    }
  }

  async loadStatuses() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.apiService.getApi(true, 'order-statuses-' + this.data.id, '/logistics/getOrderStatuses', { 'id': this.data.id }).subscribe(async (res: any) => {
      this.statuses = res;
      await loading.dismiss();
    });

    this.apiService.getApi(true, 'system-statuses', '/logistics/getStatuses').subscribe(async (res: any) => {
      this.systemStatuses = res;
    });
  }

  loadOtherData() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });

    this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
      this.drivers = res;
    });
  }

  orderItemBackground(status) {
    if (status.id ==1) {
      return 'order-item-background-new'; 
    } else if (status.id ==2) {
      return 'order-item-background-in-company'; 
    } else if (status.id == 3) {
      return 'order-item-background-sorting'; 
    } else if (status.id == 4) {
      return 'order-item-background-parked'; 
    } else if (status.id == 5) {
      return 'order-item-background-in-progress'; 
    } else if (status.id == 6) {
      return 'order-item-background-delivered'; 
    } else if (status.id == 7) {
      return 'order-item-background-return'; 
    } else if (status.id == 8) {
      return 'order-item-background-canceled'; 
    }
  }

  orderStatusColor(status) {
    if (status.id == 1) {
      return 'dark';
    } else {
      return 'light';
    }
  }

  async changeWhoPay() {
    const modal = await this.modalController.create({
      component: ChangeWhoPayModalPage,
      componentProps: {
        orderData: this.data,
        orderCost: this.data.order_costs[0]
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }

  async changeCost() {
    const modal = await this.modalController.create({
      component: ChangeTransCostModalPage,
      componentProps: {
        orderData: this.data,
        orderCost: this.data.order_costs[0]
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }

  async listStatus() {
    const pop = await this.popoverController.create({
      component: StatusPopoverComponent,
      componentProps: { statuses: this.statuses, orderId: this.data.oid },
      cssClass: 'status-popover-class',
      // event: ev,
      // showBackdrop: false,
      mode: 'ios'
    });
    return await pop.present();
  }

  async listPackges() {
    const pop = await this.popoverController.create({
      component: PackgesPopoverComponent,
      componentProps: { 
        packages: this.data.order_details,
        order: this.data,
        canEdit: this.data.status_id < 6 ? true : false
      },
      cssClass: 'status-popover-class',
      mode: 'ios'
    });
    await pop.present();
    pop.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }

  async showQR() {
    const pop = await this.popoverController.create({
      component: ShowQrPopoverComponent,
      componentProps: { qrData: this.data.oid },
      cssClass: 'popover-content',
      mode: 'ios'
    });
    return await pop.present();
  }

  async changeStatus() {
    const modal = await this.modalController.create({
      component: ChangeStatusModalPage,
      componentProps: { order: this.data, statuses: this.systemStatuses, drivers: this.drivers },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
        this.apiService.getApi(true, 'order-statuses', '/logistics/getOrderStatuses', { 'id': this.data.id }).subscribe(async (res: any) => {
          this.statuses = res;
        });
      }
    });

  }

  async addPayment() {
    const modal = await this.modalController.create({
      component: AddPaymentModalPage,
      componentProps: { order: this.data, statuses: this.systemStatuses },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });

  }

  async editOrder() {
    const modal = await this.modalController.create({
      component: EditOrderModalPage,
      componentProps: {order: this.data, cities: this.cities},
      cssClass: 'customer-modal',
      backdropDismiss: true
    });
    await modal.present();
    
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }
  
  async editDriver() {
    const modal = await this.modalController.create({
      component: EditDriverModalPage,
      componentProps: {order: this.data, drivers: this.drivers},
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
    
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }

  makeCall(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  private isArabic(text: string) {
    var position = text.search(/[\u0600-\u06FF]/);
    return position >= 0;
  }

  private reverseArabic(text: string) {
    var position = text.search(/[\u0600-\u06FF]/);
    if (position >= 0) {
      return text.split(' ').reverse().join('  ');
    } else {
      return text;
    }
  }


  print() {
    this.printService.changeFont(this.data);
  }

  changeFont() {
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
    const logo = { image: this.logoData, width: 50 };
    const barcode = { image: this.textToBase64Barcode(this.data.oid), width: 200 };
    const docDefinition = {
      pageSize: 'A5',
      pageOrientation: 'landscape',
      pageMargins: [20, 30, 20, 10],
      content: [
        { columns: [barcode, { text: this.reverseArabic(this.data.company.name), alignment: "right", style: 'header' }] },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            new Date(this.data.due_date).toLocaleDateString(),
            {
              columns: [
                { text: this.data.oid, alignment: "right", style: "bold" },
                { text: this.reverseArabic('طلبية رقم'), alignment: "right" },
              ]
            }
          ], style: 'margin_top'
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            { width: '50%', text: 'إلى', style: 'header', alignment: "right" },
            { width: '50%', text: 'من', style: 'header', alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '50%', text: this.reverseArabic(this.data.end_customer_name), alignment: "right" },
            { width: '50%', text: this.reverseArabic(this.data.customer.name), alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '50%', text: this.reverseArabic(this.data.to.name), alignment: "right" },
            { width: '50%', text: this.reverseArabic(this.data.from.name), alignment: "right" }
          ]
        },
        {
          columns: [
            { width: '50%', text: this.reverseArabic(this.data.end_customer_address), alignment: "right" },
            { width: '50%', text: this.reverseArabic(this.data.customer.address), alignment: "right" }
          ]
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 557, y2: 5, lineWidth: 1 }] },
        {
          columns: [
            // { width: '30%', qr: this.data.oid, fit: '100' },
            // {image : this.textToBase64Barcode(this.data.oid)},
            
            {
              columns: [
                {
                  width: '30%',
                  text: ""
                    + '\n' + this.reverseArabic(this.payOnDelivery())
                    + '\n' + this.reverseArabic(this.whoPay()),
                  alignment: "right"
                },
                {
                  width: '70%',
                  text: this.data.order_costs[0].packages_count + ' : ' + this.reverseArabic(' عدد الطرود ')
                    + '\n' + this.data.order_costs[0].packages_cost + ' : ' + this.reverseArabic(' تكلفة الطرود ')
                    + '\n' + this.data.order_costs[0].trans_cost + ' : ' + this.reverseArabic(' تكلفة الشحن ')
                    + '\n' + this.data.order_costs[0].to_collect + ' : ' + this.reverseArabic(' مبلغ التحصيل '),
                  alignment: "right"
                }
              ]
            }
          ], style: 'margin_top'
        },
        { text: 'act.ps', style: 'act', alignment: "center" }

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

  payOnDelivery() {
    if (this.data.order_costs[0].pay_on_delivery == 1) {
      return 'الدفع عند التسليم: نعم';
    }
    return 'الدفع عند التسليم: لا';
  }

  whoPay() {
    if (this.data.order_costs[0].who_pays == 1) {
      return "التوصيل على المرسل";
    } else if (this.data.order_costs[0].who_pays == 2) {
      return "التوصيل على المستلم";
    } else if (this.data.order_costs[0].who_pays == 3) {
      return "توصيل مجاني";
    }
    return '';
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `order_${this.data.oid}.pdf`;
          const result = await Filesystem.writeFile({
            path: path,
            data: data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          this.fileOpener.open(result.uri, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
        } catch (e) {
          console.log('Unable to write file');
        }
      });
    } else {
      this.pdfObj.download();
    }
  }

  loadLocalAssetToBase64() {
    this.http.get('./assets/logo.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result;
        }
        reader.readAsDataURL(res);
      });
  }

  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE39" });
    return canvas.toDataURL("image/png");
  }

  back() {
    this.dataService.setData(this.data.id, this.filterData);
    this.router.navigate(['/tabs/orders/' + this.data.id]);
  }

}
