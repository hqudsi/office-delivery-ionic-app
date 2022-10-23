import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { Chart } from "chart.js";
import { AlertController, IonContent, LoadingController, PopoverController, ViewDidEnter } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { StatusPopoverComponent } from 'src/app/popovers/status-popover/status-popover.component';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, ViewDidEnter {
  @ViewChild(IonContent) content: IonContent;

  @ViewChild("pieCanvasOrders") pieCanvasOrders: ElementRef;
  @ViewChild("pieCanvasCollections") pieCanvasCollections: ElementRef;

  direction: string = '';
  ordersLabels = [];
  ordersData = [];
  searchValue: string = '';
  collectionsLabels = [];
  collectionsData = [];
  collection: any;
  scannedData: any;
  userType: any;
  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    private loadingController: LoadingController,
    private translatePipe: TranslatePipe,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private barcodeScanner: BarcodeScanner
  ) {
    this.userType = authService.user.type;
  }

  ngOnInit() {
    this.direction = this.languageService.getCurrentDirection();
  }

  ionViewDidEnter() {
    this.ordersLabels = [];
    this.ordersData = [];
    this.collectionsData = [];
    this.loadData(true, 1000);
    this.content.scrollToTop(0);
  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scannedData = barcodeData.text;
      this.searchQR();
    }).catch(err => {
      console.log('Error', 'err');
    });
  }

  // searchKey(event) {
  //   if (event.key === "Enter" || event.code === "Enter" ) {
  //     console.log(event.key);
  //     this.search();
  //   }
  // }

  yourSearchFunction(value) {
    this.searchValue = value;
    this.search();
  }

  async search() {
    if (this.searchValue != '') {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();
      this.apiService.getApi(true, 'order-statuses-' + this.searchValue, '/logistics/getOrderStatusesByOid', { 'oid': this.searchValue, 'user_type': this.userType, 'company_id': this.authService.companyId() }).subscribe(async (res: any) => {
        await loading.dismiss();
        if (res) {
          const pop = await this.popoverController.create({
            component: StatusPopoverComponent,
            componentProps: { statuses: res.statuses, orderId: res.order_id },
            cssClass: 'status-popover-class',
            // event: ev,
            // showBackdrop: false,
            mode: 'ios'
          });
          await pop.present();
        } else {
          this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.order_not_found'));
        }
      });
      this.searchValue = '';
    }
  }

  async searchQR() {
    if (this.scannedData != '') {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();
      this.apiService.getApi(true, 'order-statuses-' + this.scannedData, '/logistics/getOrderStatusesByOid', { 'oid': this.scannedData }).subscribe(async (res: any) => {
        await loading.dismiss();
        if (res) {
          const pop = await this.popoverController.create({
            component: StatusPopoverComponent,
            componentProps: { statuses: res },
            cssClass: 'status-popover-class',
            // event: ev,
            // showBackdrop: false,
            mode: 'ios'
          });
          await pop.present();
        } else {
          this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.order_not_found'));
        }
      });
      this.scannedData = '';
    }
  }

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

  async loadData(refresh = false, animationDuration, refresher?) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });

    this.apiService.getApi(refresh, 'my-orders-statistics', '/logistics/getMyOrdersStatistics').subscribe(async (res: any) => {
      this.ordersLabels = [];
      this.ordersData = [];
      for (var key in res) {
        if (key != 'allOrders' && key != 'deliveredOrders' && key != 'returnOrders' && key != 'canceledOrders') {
          this.ordersLabels.push(this.translatePipe.transform('DASHBOARD.' + key));
          this.ordersData.push(res[key]);
        }
      }
      this.createChartOrder(animationDuration);
      if (refresher) {
        refresher.target.complete();
      }
    });

    if (this.userType == 2) {
      // 
      this.apiService.getApi(refresh, 'my-transactions-dashboard', '/logistics/getMyTransactionsDashboard').subscribe(async (res: any) => {
        this.collectionsLabels = [];
        this.collectionsData = [];
        if (res) {
          this.collection = res['balance'];
          this.collectionsLabels.push(this.translatePipe.transform('FINANCE.debit'));
          this.collectionsLabels.push(this.translatePipe.transform('FINANCE.credit'));
          this.collectionsData.push(res['debit']);
          this.collectionsData.push(res['credit']);
        }
        this.createChartCollection(animationDuration);
        if (refresher) {
          refresher.target.complete();
        }
      });
    } else {
      if (this.userType != 4 && this.userType != 5) {
        this.apiService.getApi(refresh, 'my-collection-dashboard', '/logistics/getMyCollectionDashboard').subscribe(async (res: any) => {
          this.collectionsLabels = [];
          this.collectionsData = [];
          if (res) {
            this.collection = res['collection'];
            this.collectionsLabels.push(this.translatePipe.transform('DASHBOARD.payment'));
            this.collectionsLabels.push(this.translatePipe.transform('DASHBOARD.revenue'));
            this.collectionsData.push(res['payment']);
            this.collectionsData.push(res['revenue']);
          }
          this.createChartCollection(animationDuration);
          if (refresher) {
            refresher.target.complete();
          }
        });
      }
    }
  }

  createChartOrder(animationDuration) {

    let data = {
      labels: this.ordersLabels,
      datasets: [
        {
          data: this.ordersData,
          backgroundColor: [
            'rgb(153, 76, 0)',
            'rgb(204, 102, 0)',
            'rgb(255, 128, 0)',
            'rgb(255, 153, 51)',
            'rgb(255, 178, 102)'
          ],
          hoverOffset: 4
        }
      ]
    };

    let options = {
      responsive: true,
      legend: {
        display: true,
        position: "left"
      },
      animation: {
        duration: animationDuration
      }
    };

    new Chart(this.pieCanvasOrders.nativeElement, {
      // type: "pie",
      type: 'doughnut',
      data: data,
      options: options
    });
  }

  createChartCollection(animationDuration) {

    let data = {
      labels: this.collectionsLabels,
      datasets: [
        {
          data: this.collectionsData,
          backgroundColor: [
            'rgb(204, 102, 0)',
            'rgb(255, 153, 51)'
          ],
          hoverOffset: 4
        }
      ]
    };

    let options = {
      responsive: true,
      legend: {
        display: true,
        position: "left"
      },
      animation: {
        duration: animationDuration
      }
    };

    new Chart(this.pieCanvasCollections.nativeElement, {
      type: "doughnut",
      data: data,
      options: options
    });
  }

}
