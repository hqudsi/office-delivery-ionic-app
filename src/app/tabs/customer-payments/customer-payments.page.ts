import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter, IonContent, LoadingController, Platform, ModalController } from '@ionic/angular';
import { ChangeOrdersStatusModalPage } from 'src/app/modals/change-orders-status-modal/change-orders-status-modal.page';
import { EditFilterModalPage } from 'src/app/modals/edit-filter-modal/edit-filter-modal.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';
import { PrintPaymentService } from 'src/app/services/print-payment.service';

@Component({
  selector: 'app-customer-payments',
  templateUrl: './customer-payments.page.html',
  styleUrls: ['./customer-payments.page.scss'],
})
export class CustomerPaymentsPage implements OnInit, ViewDidEnter {
  @ViewChild(IonContent) content: IonContent;

  showIfinite = true;

  top: number = 0;
  
  payments: any[] = [];
  paymentsCollection: any;
  approxItemHeight: string = '48px';
  
  post: boolean = null;
  from_date: any = null;
  to_date: any = null;
  customers: any;
  customer_id: any = null;
  hasFilter: boolean = false;

  selectedAll: boolean = false;
  selectedSome: boolean = false;
  selectedSameStatus: boolean = false;

  userType: any;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private dataService: DataService,
    private router: Router,
    private plt: Platform,
    private modalController: ModalController,
    private renderer: Renderer2,
    private printPaymentService: PrintPaymentService
    ) {
      if (this.plt.is('ios')) {
        this.approxItemHeight = '44px';
      }
      this.userType = authService.user.type;
    }

  ngOnInit() {
    let element: any = document.getElementById('main-content');
    this.renderer.setStyle(element, 'top', "0px");
    for (let c of element.children) {
      this.renderer.setStyle(c, 'opacity', 1);
    }

  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  
  // var base64 = getBase64Image(document.getElementById("imageid"));

  ionViewDidEnter() {
    this.showIfinite = true;
    
    this.loadData(true);
    this.loadFilterData();
  }

  logScrolling(event) {
    this.top = event.detail.scrollTop;
  }
  
  scrollToTop() {
    this.content.scrollToTop(this.top);
  }

  async print() {
    let selectedPayments = this.payments.filter( element => element.isChecked );
    await this.printPaymentService.changeFont(selectedPayments);
  }
  
  async filter() {
    const modal = await this.modalController.create({
      component: EditFilterModalPage,
      componentProps: {
        showPost: true,
        post: this.post,
        showDate: true,
        from_date: this.from_date,
        to_date: this.to_date,
        showCustomer: true,
        customers: this.customers,
        customer_id: this.customer_id
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
    
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.hasFilter = true;
        this.post = result.data.post;
        this.from_date = result.data.from_date ? result.data.from_date.split('T')[0] : null;
        this.to_date = result.data.to_date ? result.data.to_date.split('T')[0] : null;
        this.customer_id = result.data.customer_id;
        this.loadData(true);
        this.loadFilterData();
      }
    });
  }

  clearFilter() {
    this.post = null;
    this.hasFilter = false;
    this.from_date = null;
    this.to_date = null;
    this.customer_id = null;
    this.loadData(true);
    this.loadFilterData();
  }

  selectAll() {
    this.payments.forEach(element => {
      element.isChecked = true;
    });
    this.selectedAll = true;
    this.checkSelectedStatus();
  }

  unSelectAll() {
    this.payments.forEach(element => {
      element.isChecked = false;
    });
    this.selectedAll = false;
    this.selectedSome = false;
    this.checkSelectedStatus();
  }

  changeSelect() {
    let checkerSome = arr => arr.some(element => element.isChecked === true);
    this.selectedSome = checkerSome(this.payments);
    let checkerAll = arr => arr.every(element => element.isChecked === true);
    this.selectedAll = checkerAll(this.payments);
    this.checkSelectedStatus();
  }

  checkSelectedStatus() {
    let selectedPayments = this.payments.filter( element => element.isChecked )
    this.selectedSameStatus = selectedPayments.every( element => element.post != 1 );
  }

  loadFilterData() {
    if (this.userType != 2) {
      this.apiService.getApi(true, 'my-customers', '/logistics/getMyCustomers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
        this.customers = res;
      });
    }
  }

  async loadData(refresh = false, refresher?) {
    this.showIfinite = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    if (!refresher) {
      await loading.present();
    }
    let dataRequest: any;
    dataRequest =  {
      'type': this.authService.user.type,
      'user_id': this.authService.userDetails.id,
      'company_id': this.authService.companyId(),
      'post': this.post,
      'from_date': this.from_date,
      'to_date': this.to_date,
      'customer_id': this.customer_id
    };
    this.apiService.getApi(refresh, 'my-customer-payments', '/logistics/getCustomerPayments', dataRequest).subscribe(async (res: any) => {
      this.paymentsCollection = res
      this.payments = res.data;
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  loadMoreItems(event) {
    let page = this.paymentsCollection.current_page + 1;
    let dataRequest: any;
    dataRequest =  {
      'type': this.authService.user.type,
      'user_id': this.authService.userDetails.id,
      'company_id': this.authService.companyId(),
      'post': this.post,
      'from_date': this.from_date,
      'to_date': this.to_date,
      'customer_id': this.customer_id,
      'page': page 
    };

    if (page > this.paymentsCollection.last_page) {
      this.showIfinite = false;
    } else {
      this.apiService.getApi(true, 'my-customer-payments', '/logistics/getCustomerPayments', dataRequest).subscribe(async (res: any) => {
        if (res) {
          this.paymentsCollection = res;
          if (this.payments) {
            this.payments = this.payments.concat(res.data);
          } else {
            this.payments = res.data;
          }
          event.target.complete();
          if (page === this.paymentsCollection.last_page) {
            this.showIfinite = false;
          } else {
            this.showIfinite = true;
          }
        }
      });
    }
  }

  showDetails(payment) {
    this.showIfinite = true;
    this.dataService.setData(payment.id, payment);
    this.router.navigate(['/tabs/details/customer-payment/' + payment.id], {replaceUrl: true});
  }

  async changeStatus() {

    let selectedPayments = this.payments.filter( element => element.isChecked );
    this.showIfinite = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    selectedPayments.forEach((element, index) => {
      this.apiService.postApi('/logistics/approveCustomerPayment', element).subscribe(
        async (res: any) => {
          if (res) {
            if ((index +1) == selectedPayments.length) {
              this.loadData(true);
              this.loadFilterData();
              await loading.dismiss();
            }
          }
        }, async (error) => {
          console.log('error change status');
        }
      );
    });
  }

  myHeaderFn(record, recordIndex, records) {
    if (recordIndex % 20 === 0) {
      return 'Header ' + recordIndex;
    }
    return null;
  }

}
