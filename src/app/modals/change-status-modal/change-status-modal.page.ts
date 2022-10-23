import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddPaymentModalPage } from '../add-payment-modal/add-payment-modal.page';

@Component({
  selector: 'app-change-status-modal',
  templateUrl: './change-status-modal.page.html',
  styleUrls: ['./change-status-modal.page.scss'],
})
export class ChangeStatusModalPage implements OnInit {
  order: any;
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
    this.order = this.navParams.data.order;
    this.statuses = this.navParams.data.statuses;
    this.userType = authService.user.type;
    this.drivers = this.navParams.data.drivers;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      id: [null, [Validators.required]],
      status: [null, [Validators.required]],
      amount: [0, []],
      customer_id: [null, []],
      company_id: [null, []],
      notes: ['', []],
      driver_id: [null, []]
    });
    this.formGroup.patchValue({ id: this.order.id });
    this.formGroup.patchValue({ company_id: this.order.company_id });
    this.formGroup.patchValue({ customer_id: this.order.customer_id });
    this.formGroup.patchValue({ customer_id: this.order.driver_id });
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    if (this.formGroup.valid && (this.formGroup.value.status != 5 || (this.formGroup.value.status == 5 && this.formGroup.value.driver_id != null) )) {
      if (this.formGroup.value.status == 6 && !this.order.order_costs[0].collected) {
        // await this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
        const modal = await this.modalController.create({
          component: AddPaymentModalPage,
          componentProps: { order: this.order, statuses: this.statuses },
          cssClass: 'cal-modal',
          backdropDismiss: true
        });
        await modal.present();
    
        modal.onDidDismiss().then((result) => {
          if (result.data) {
            this.order = result.data;
            this.changeOrderStatus();
          }
        });
      } else {
        this.changeOrderStatus();
      }


      // this.modalController.dismiss({event: this.event});
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
  }

  async changeOrderStatus() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.apiService.postApi('/logistics/changeOrderStatus', this.formGroup.value).subscribe(
      async (res: any) => {
        await loading.dismiss();
        if (res) {
          if (res.success) {
            this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_change_status'));
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
