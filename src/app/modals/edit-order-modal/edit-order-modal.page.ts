import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-order-modal',
  templateUrl: './edit-order-modal.page.html',
  styleUrls: ['./edit-order-modal.page.scss'],
})
export class EditOrderModalPage implements OnInit {
  order: any;
  cities: any;
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
    this.cities = this.navParams.data.cities;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      order_id: [null, [Validators.required]],
      end_customer_name: [null, [Validators.required]],
      city: [null, [Validators.required]],
      end_customer_address: [null, [Validators.required]],
      end_customer_phone: [null, [Validators.required]]
    });

    this.formGroup.patchValue({ order_id: this.order.id });
    this.formGroup.patchValue({ end_customer_name: this.order.end_customer_name });
    this.formGroup.patchValue({ city: this.order.to.id });
    this.formGroup.patchValue({ end_customer_address: this.order.end_customer_address });
    this.formGroup.patchValue({ end_customer_phone: this.order.end_customer_phone });
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

      this.apiService.postApi('/logistics/editOrder', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_edit_order'));
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
