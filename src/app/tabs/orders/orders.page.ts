import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, ModalController, Platform, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ChangeOrdersStatusModalPage } from 'src/app/modals/change-orders-status-modal/change-orders-status-modal.page';
import { EditFilterModalPage } from 'src/app/modals/edit-filter-modal/edit-filter-modal.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';
import { PrintService } from 'src/app/services/print.service';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, ViewDidEnter {
  @ViewChild(IonContent) content: IonContent;

  showIfinite = true;

  top: number = 0;
  orderStatusColorBack: string = 'danger';
  orderStatusColorDone: string = 'success';
  orderStatusColorInprogress: string = 'warning';

  orders: any[] = [];
  ordersCollection: any;
  approxItemHeight: string = '48px';

  order_id: number = null;
  cities: any;
  city_id: number = null;
  statuses: any;
  status: number = null;
  status_multi = null;
  financial_status: number = null;
  financial_status_multi = null;
  from_date: any = null;
  to_date: any = null;
  drivers: any;
  driver_id: any = null;
  customers: any;
  customer_id: any = null;
  end_customer_name: any = null;
  hasFilter: boolean = false;

  selectedAll: boolean = false;
  selectedSome: boolean = false;
  selectedSameStatus: boolean = false;

  userType: any;
  isWeb: boolean = false;
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
    private printService: PrintService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) {
    if (this.plt.is('ios')) {
      this.approxItemHeight = '44px';
    } else if (this.plt.is('desktop') || this.plt.is('pwa')) {
      this.isWeb = true;
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

  ionViewDidEnter() {
    this.showIfinite = true;
    if (this.route.snapshot.data['data']) {
      this.status_multi = this.route.snapshot.data['data'].status_multi;
      this.order_id = this.route.snapshot.data['data'].order_id;
      this.cities = this.route.snapshot.data['data'].cities;
      this.city_id = this.route.snapshot.data['data'].city_id;
      this.financial_status_multi = this.route.snapshot.data['data'].financial_status_multi;
      this.from_date = this.route.snapshot.data['data'].from_date;
      this.to_date = this.route.snapshot.data['data'].to_date;
      this.drivers = this.route.snapshot.data['data'].drivers;
      this.driver_id = this.route.snapshot.data['data'].driver_id;
      this.customers = this.route.snapshot.data['data'].customers;
      this.customer_id = this.route.snapshot.data['data'].customer_id;
      this.end_customer_name = this.route.snapshot.data['data'].end_customer_name;
      this.hasFilter = true;
    } else {
      this.status_multi = null;
      this.hasFilter = false;
    }
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
    let selectedOrders = this.orders.filter(element => element.isChecked);
    await this.printService.changeFont(selectedOrders);
    // window.location.reload();
  }

  async filter() {
    const modal = await this.modalController.create({
      component: EditFilterModalPage,
      componentProps: {
        showOrderId: true,
        order_id: this.order_id,
        showCity: true,
        cities: this.cities,
        city_id: this.city_id,
        showStatus: false,
        statuses: this.statuses,
        status: this.status,
        showStatusMulti: true,
        status_multi: this.status_multi,
        showFinancialStatus: false,
        financial_status: this.financial_status,
        showFinancialStatusMulti: true,
        financial_status_multi: this.financial_status_multi,
        showDate: true,
        from_date: this.from_date,
        to_date: this.to_date,
        showDriver: true,
        drivers: this.drivers,
        driver_id: this.driver_id,
        showCustomer: true,
        customers: this.customers,
        customer_id: this.customer_id,
        showEndCustomer: true,
        end_customer_name: this.end_customer_name
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.hasFilter = true;
        this.order_id = result.data.order_id,
        this.city_id = result.data.city_id;
        this.status = result.data.status;
        this.status_multi = result.data.status_multi;
        this.financial_status = result.data.financial_status;
        this.financial_status_multi = result.data.financial_status_multi;
        this.from_date = result.data.from_date ? result.data.from_date.split('T')[0] : null;
        this.to_date = result.data.to_date ? result.data.to_date.split('T')[0] : null;
        this.driver_id = result.data.driver_id;
        this.customer_id = result.data.customer_id;
        this.end_customer_name = result.data.end_customer_name;
        this.loadData(true);
        this.loadFilterData();
      }
    });
  }

  clearFilter() {
    this.order_id = null;
    this.city_id = null;
    this.status = null;
    this.status_multi = null;
    this.hasFilter = false;
    this.from_date = null;
    this.to_date = null;
    this.driver_id = null;
    this.customer_id = null;
    this.financial_status = null;
    this.financial_status_multi = null;
    this.end_customer_name = null;
    this.loadData(true);
    this.loadFilterData();
  }

  selectAll() {
    this.orders.forEach(element => {
      element.isChecked = true;
    });
    this.selectedAll = true;
    this.checkSelectedStatus();
  }

  unSelectAll() {
    this.orders.forEach(element => {
      element.isChecked = false;
    });
    this.selectedAll = false;
    this.selectedSome = false;
    this.checkSelectedStatus();
  }

  changeSelect() {
    let checkerSome = arr => arr.some(element => element.isChecked === true);
    this.selectedSome = checkerSome(this.orders);
    let checkerAll = arr => arr.every(element => element.isChecked === true);
    this.selectedAll = checkerAll(this.orders);
    this.checkSelectedStatus();
  }

  checkSelectedStatus() {
    let selectedOrders = this.orders.filter(element => element.isChecked);
    this.selectedSameStatus = selectedOrders.every(element => element.status_id === selectedOrders[0].status_id);
  }

  async deleteOrder() {
    const confirm = await this.confirmationAlert(this.translatePipe.transform('ALERTS.sure_delete'));
    if (!confirm) {
      return null;
    }
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    let selectedOrders = this.orders.filter(element => element.isChecked && element.status_id < 6);
    selectedOrders.forEach(async (element, index) => {
      this.apiService.postApi('/logistics/deleteOrder', { order_id: element.id, to_collect: element.order_costs[0].to_collect }).subscribe(async (res: any) => {
        if ((index + 1) === selectedOrders.length) {
          await loading.dismiss();
          this.loadData(true);
        }
      });
    });

  }

  private async confirmationAlert(messageText: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('ALERTS.Confirmation'),
      message: `${messageText}`,
      backdropDismiss: false,
      buttons: [
        {
          text: this.translatePipe.transform('no'),
          handler: () => resolveFunction(false)
        },
        {
          text: this.translatePipe.transform('yes'),
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

  loadFilterData() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });
    this.apiService.getApi(true, 'system-statuses', '/logistics/getStatuses').subscribe(async (res: any) => {
      this.statuses = res;
    });
    if (this.userType != 2) {
      this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
        this.drivers = res;
      });
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
    dataRequest = {
      'type': this.authService.user.type,
      'user_id': this.authService.userDetails.id,
      'company_id': this.authService.companyId(),
      'status': this.status,
      'status_multi': this.status_multi,
      'financial_status': this.financial_status,
      'financial_status_multi': this.financial_status_multi,
      'order_id': this.order_id,
      'city_id': this.city_id,
      'from_date': this.from_date,
      'to_date': this.to_date,
      'driver_id': this.driver_id,
      'customer_id': this.customer_id,
      'end_customer_name': this.end_customer_name
    };
    this.apiService.postApi('/logistics/getOrders', dataRequest).subscribe(async (res: any) => {
      if (res.success) {
        this.ordersCollection = res.data
        this.orders = res.data.data;
      }
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  loadMoreItems(event) {
    let page = this.ordersCollection.current_page + 1;
    let dataRequest: any;
    dataRequest = {
      'type': this.authService.user.type,
      'user_id': this.authService.userDetails.id,
      'company_id': this.authService.companyId(),
      'status': this.status,
      'status_multi': this.status_multi,
      'financial_status': this.financial_status,
      'financial_status_multi': this.financial_status_multi,
      'order_id': this.order_id,
      'city_id': this.city_id,
      'from_date': this.from_date,
      'to_date': this.to_date,
      'driver_id': this.driver_id,
      'customer_id': this.customer_id,
      'end_customer_name': this.end_customer_name,
      'page': page
    };

    if (page > this.ordersCollection.last_page) {
      this.showIfinite = false;
    } else {
      this.apiService.postApi('/logistics/getOrders', dataRequest).subscribe(async (ordersRes: any) => {
        if (ordersRes) {
          
          if (ordersRes.success) {
            this.ordersCollection = ordersRes.data;
            if (this.orders) {
              this.orders = this.orders.concat(ordersRes.data.data);
            } else {
              this.orders = ordersRes.data.data;
            }
          }

          
          event.target.complete();
          if (page === this.ordersCollection.last_page) {
            this.showIfinite = false;
          } else {
            this.showIfinite = true;
          }
        }
      });
    }
  }
  // hani
  showDetails(order) {
    this.showIfinite = true;
    let filterData = {
      order_id: this.order_id,
      cities: this.cities,
      city_id: this.city_id,
      status_multi: this.status_multi,
      financial_status_multi: this.financial_status_multi,
      from_date: this.from_date,
      to_date: this.to_date,
      drivers: this.drivers,
      driver_id: this.driver_id,
      customers: this.customers,
      customer_id: this.customer_id,
      end_customer_name: this.end_customer_name
    };
    this.dataService.setData(order.id, {order: order, filterData: filterData});
    this.router.navigate(['/tabs/details/order/' + order.id], { replaceUrl: true });
  }

  async changeStatus() {

    let selectedOrders = this.orders.filter(element => element.isChecked);
    const modal = await this.modalController.create({
      component: ChangeOrdersStatusModalPage,
      componentProps: {
        orders: selectedOrders,
        statuses: this.statuses,
        drivers: this.drivers
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadData(true);
        this.loadFilterData();
      }
    });
  }

  myHeaderFn(record, recordIndex, records) {
    if (recordIndex % 20 === 0) {
      return 'Header ' + recordIndex;
    }
    return null;
  }

  orderItemBackground(status) {
    if (status.id == 1) {
      return 'order-item-background-new';
    } else if (status.id == 2) {
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

  // doneOrderBackground(order) {
  //   if (order.status_id === 6 && order.financial_status === 4) {
  //     return 'order-done-background';
  //   }
  // }

  orderStatusColor(status, financial_status) {
    if (financial_status === 4) {
      return 'dark'
    }
    if (status.id == 1) {
      return 'dark';
    } else {
      return 'light';
    }
  }

}
