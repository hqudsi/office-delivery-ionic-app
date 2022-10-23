import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-driver-modal',
  templateUrl: './edit-driver-modal.page.html',
  styleUrls: ['./edit-driver-modal.page.scss'],
})
export class EditDriverModalPage implements OnInit {
  order: any;
  drivers: any;
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
    this.drivers = this.navParams.data.drivers;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      order_id: [null, [Validators.required]],
      driver_id: [null, [Validators.required]]
    });

    this.formGroup.patchValue({ order_id: this.order.id });
    this.formGroup.patchValue({ driver_id: this.order.driver_id });
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

      this.apiService.postApi('/logistics/editOrderDriver', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_edit_driver'));
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
