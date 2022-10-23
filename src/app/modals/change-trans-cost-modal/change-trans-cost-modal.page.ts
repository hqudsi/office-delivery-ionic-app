import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-trans-cost-modal',
  templateUrl: './change-trans-cost-modal.page.html',
  styleUrls: ['./change-trans-cost-modal.page.scss'],
})
export class ChangeTransCostModalPage implements OnInit {

  formGroup: FormGroup;
  orderData: any;
  orderCost: any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private translatePipe: TranslatePipe,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController
  ) {
    this.orderData = JSON.parse(JSON.stringify(this.navParams.data.orderData));
    this.orderCost = JSON.parse(JSON.stringify(this.navParams.data.orderCost));
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      order_id: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      notes: [null, []]
    });
    this.formGroup.patchValue({ order_id: this.orderData.id });
    this.formGroup.patchValue({ amount: this.orderCost.trans_cost });
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
  
      this.apiService.postApi('/logistics/editTansCost', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_edit_trans_cost'));
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
