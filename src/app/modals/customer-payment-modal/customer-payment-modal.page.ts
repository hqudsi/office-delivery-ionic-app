import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-customer-payment-modal',
  templateUrl: './customer-payment-modal.page.html',
  styleUrls: ['./customer-payment-modal.page.scss'],
})
export class CustomerPaymentModalPage implements OnInit {
  customers: any;
  formGroup: FormGroup;
  order_oid;
  orders_array = [];
  orders_text;
  not_found_orders_text;
  orders;
  total = 0;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private translatePipe: TranslatePipe,
    private authService: AuthenticationService
  ) {
    this.customers = this.navParams.data.customers;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      customer_id: [null, [Validators.required]],
      company_id: [null, [Validators.required]],
      orders: [null, [Validators.required]],
      total: [0, []],
      not_found_orders: [null, []],
      manual_number: [null, []]
    });
    this.formGroup.patchValue({ company_id: this.authService.companyId() });
  }

  search(event) {
    if (event.target.value) {
      let index = this.orders.findIndex(element => element.oid.toLowerCase() == event.target.value.toLowerCase());
      if (index != -1) {
        this.orders[index].isChecked = true;
      } else {
        if (this.not_found_orders_text) {
          this.not_found_orders_text = this.not_found_orders_text + ', ' + event.target.value
        } else {
          this.not_found_orders_text = event.target.value
        }
        this.formGroup.patchValue({ not_found_orders: this.not_found_orders_text });
      }
      event.target.value = null;
      this.inputSearh(event);
    }
  }

  onCustomerChange(event) {
    this.orders = null;
    this.total = 0;
    this.formGroup.patchValue({ total: 0 });
    this.apiService.getApi(true, 'getCustomerCollectedOrders', '/logistics/getCustomerCollectedOrders', { customer_id: event.target.value, 'company_id': this.authService.companyId() }).subscribe(async (res: any) => {
      this.orders = res;
      this.orders.forEach(order => {
        order.display = true;
      });
    });
  }

  close() {
    this.modalController.dismiss();
  }

  addOrder() {
    let found = this.orders.find(element => element == this.order_oid);
    let hasSame = this.orders_array.find(element => element == this.order_oid);
    if (found && !hasSame) {
      this.orders_array.push(this.order_oid);
      this.formGroup.patchValue({ orders: this.orders_array });
      if (this.orders_text) {
        this.orders_text = this.orders_text + String.fromCharCode(13, 10) + this.order_oid;
      } else {
        this.orders_text = this.order_oid;
      }
    }
    this.order_oid = null;
  }

  async save() {

    if (this.orders) {

      const checkedOrders = this.orders.filter(order => order.isChecked);
      this.formGroup.patchValue({ orders: checkedOrders });
      if (this.formGroup.valid) {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class-1',
          mode: 'md'
        });
        await loading.present();

        this.apiService.postApi('/logistics/addCustomerPaymentOrders', this.formGroup.value).subscribe(
          async (res: any) => {
            await loading.dismiss();
            if (res) {
              if (res.success) {
                this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_add_voucher'));
                this.modalController.dismiss(res.data);
              } else {
                this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
              }
            }
          }, async (error) => {
            await loading.dismiss();
            this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
          }
        );
        // this.modalController.dismiss({event: this.event});
      } else {
        this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
      }
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
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

  async inputSearh(event) {
    const query = event.target.value.toLowerCase();
    requestAnimationFrame(() => {
      this.orders.forEach(order => {
        const shouldShow = order.oid.toLowerCase().indexOf(query) > -1;
        order.display = shouldShow ? true : false;
      });
    });
  }

  checkOrder() {
    const checkedOrders = this.orders.filter(order => order.isChecked);
    // this.total = checkedOrders.reduce((acc, obj) => acc + obj.order_costs[0].packages_cost, 0);
    this.total =0;
    checkedOrders.forEach(element => {
        let packCost = 0;
        if (element.order_costs[0].pay_on_delivery === 1) {
          packCost = element.order_costs[0].packages_cost;
        }
        if (element.order_costs[0].who_pays === 1) { // Sender
          this.total = this.total + packCost - element.order_costs[0].trans_cost
        } else {
          this.total = this.total + packCost
        }
    });

    this.formGroup.patchValue({ total: this.total });
    // this.total =  checkedOrders.reduce(function(acc, obj) {
    //   // return acc + obj.order_costs[0].received;
    //   return acc + obj.order_costs[0].to_collect;
    // }, 0);
  }

}
