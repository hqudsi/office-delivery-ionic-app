import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-payment-modal',
  templateUrl: './add-payment-modal.page.html',
  styleUrls: ['./add-payment-modal.page.scss'],
})
export class AddPaymentModalPage implements OnInit {
  order: any;
  statuses: any;
  formGroup: FormGroup;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private translatePipe: TranslatePipe
  ) {
    this.order = this.navParams.data.order;
    this.statuses = this.navParams.data.statuses;
  }

  ngOnInit() {
    let totalCollect = 0;
    let packageCost = 0;
    let transCost = 0;
    if (this.order.order_costs[0].pay_on_delivery) {
      packageCost = this.order.order_costs[0].packages_cost;
    }
    if (this.order.order_costs[0].who_pays == 2) {
      transCost = this.order.order_costs[0].trans_cost;
    }

    totalCollect = (packageCost + transCost);

    this.formGroup = this.formBuilder.group({
      order_id: [null, [Validators.required]],
      company_id: [null, [Validators.required]],
      package_cost: [null, [Validators.required]],
      trans_cost: [null, [Validators.required]],
      total: [null, [Validators.required]],
      received: [null, [Validators.required, Validators.max(totalCollect), Validators.min(totalCollect)]],
      driver_id: [null, []],
      notes: [null, []]
    });
    
    this.formGroup.patchValue({ order_id: this.order.id });
    this.formGroup.patchValue({ company_id: this.order.company_id });
    this.formGroup.patchValue({ package_cost: packageCost });
    this.formGroup.patchValue({ trans_cost: transCost });
    this.formGroup.patchValue({ total: totalCollect });
    this.formGroup.patchValue({ driver_id: this.order.driver_id });
    this.formGroup.patchValue({ received: totalCollect });
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    if (this.formGroup.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();

      this.apiService.postApi('/logistics/addOrderPayment', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_payment'));
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

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }
}
