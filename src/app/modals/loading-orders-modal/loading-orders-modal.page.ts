import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-loading-orders-modal',
  templateUrl: './loading-orders-modal.page.html',
  styleUrls: ['./loading-orders-modal.page.scss'],
})
export class LoadingOrdersModalPage implements OnInit {
  drivers: any;
  formGroup: FormGroup;
  order_oid;
  orders_array = [];
  orders_text;
  not_found_orders_text;
  orders;
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
    this.orders = this.navParams.data.orders;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      driver_id: [null, [Validators.required]],
      orders: [null, [Validators.required]],
      not_found_orders: [null, []]
    });
    this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', { company_id:  this.authService.companyId() }).subscribe(async (res: any) => {
      this.drivers = res;
    });
    this.orders.forEach(order => {
      order.display = true;
    });
    // this.formGroup.patchValue({ order_id: this.order.id });
  }

  close() {
    this.modalController.dismiss();
  }

  // addOrder() {
  //   let found = this.orders.find(element => element == this.order_oid);
  //   let hasSame = this.orders_array.find(element => element == this.order_oid);
  //   if (found && !hasSame) {
  //     this.orders_array.push(this.order_oid);
  //     this.formGroup.patchValue({ orders: this.orders_array });
  //     if (this.orders_text) {
  //       this.orders_text = this.orders_text + String.fromCharCode(13, 10) + this.order_oid;
  //     } else {
  //       this.orders_text = this.order_oid;
  //     }
  //   }    
  //   this.order_oid = null;
  // }

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

  async save() {
    const checkedOrders = this.orders.filter(order => order.isChecked);
    this.formGroup.patchValue({ orders: checkedOrders });
    
    if (this.formGroup.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();

      this.apiService.postApi('/logistics/loadingOrdersDriver', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_loading_orders'));
              this.modalController.dismiss(res.data);
            } else {
              this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
            }
          }
        }, async (error) => {
          await loading.dismiss();
          this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
        }
      );
      // this.modalController.dismiss({event: this.event});
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
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

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }
}
