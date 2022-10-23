import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddPaymentModalPage } from '../add-payment-modal/add-payment-modal.page';

@Component({
  selector: 'app-change-orders-status-modal',
  templateUrl: './change-orders-status-modal.page.html',
  styleUrls: ['./change-orders-status-modal.page.scss'],
})
export class ChangeOrdersStatusModalPage implements OnInit {
  order: any;
  orders: any;
  statuses: any;
  formGroup: FormGroup;

  userType: any;
  drivers: any;
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
    this.order = this.orders[0];
    this.statuses = this.navParams.data.statuses;
    this.userType = authService.user.type;
    this.drivers = this.navParams.data.drivers;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      status: [null, [Validators.required]],
      notes: ['', []],
      amount: [0, []],
      driver_id: [null, []] 
    });
    // this.formGroup.patchValue({ id: this.order.id });
    // this.formGroup.patchValue({ company_id: this.order.company_id });
    // this.formGroup.patchValue({ customer_id: this.order.customer_id });
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    if (this.formGroup.valid && (this.formGroup.value.status != 5 || (this.formGroup.value.status == 5 && this.formGroup.value.driver_id != null) )) {
      if (this.formGroup.value.status == 6) {
        // await this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
        await this.payAllOrders();
        this.changeOrderStatus();
      } else {
        this.changeOrderStatus();
      }


      // this.modalController.dismiss({event: this.event});
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
  }

  async payAllOrders() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.orders.forEach((element, index) => {

      // ==============================
      let totalCollect = 0;
      let packageCost = 0;
      let transCost = 0;
      if (element.order_costs[0].pay_on_delivery) {
        packageCost = element.order_costs[0].packages_cost;
      }
      if (element.order_costs[0].who_pays == 2) {
        transCost = element.order_costs[0].trans_cost;
      }
      totalCollect = (packageCost + transCost);
      // ==============================
      let requestData = {
        ... {order_id: element.id },
        ... {company_id: element.company_id },
        ... {package_cost: packageCost },
        ... {trans_cost: transCost },
        ... {total: totalCollect },
        ... {driver_id: element.driver_id },
        ... {received: totalCollect },
      };
      
      this.apiService.postApi('/logistics/addOrderPayment', requestData).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if ((index +1) == this.orders.length) {
              await loading.dismiss();
            }
          }
        }, async (error) => {
          await loading.dismiss();
          this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
        }
      );
    });
  }

  async changeOrderStatus() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.orders.forEach((element, index) => {
      let requestData = {
        ... this.formGroup.value,
        ... {id: element.id},
        ... {customer_id: element.customer_id},
        ... {company_id: element.company_id}
      };
      this.apiService.postApi('/logistics/changeOrderStatus', requestData).subscribe(
        async (res: any) => {
          if (res) {
            if ((index +1) == this.orders.length) {
              this.modalController.dismiss(true);
              await loading.dismiss();
            }
          }
        }, async (error) => {
          console.log('error change status');
        }
      );
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
