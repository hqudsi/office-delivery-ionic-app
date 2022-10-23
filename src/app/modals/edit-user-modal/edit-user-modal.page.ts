import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.page.html',
  styleUrls: ['./edit-user-modal.page.scss'],
})
export class EditUserModalPage implements OnInit {

  formGroup: FormGroup;
  data: any;
  cities: any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private translatePipe: TranslatePipe,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController
  ) {
    this.data = JSON.parse(JSON.stringify(this.navParams.data.data));
    this.cities = JSON.parse(JSON.stringify(this.navParams.data.cities));
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      user_id: [null, [Validators.required]],
      user_name: [null, [Validators.required]],
      name: [null, []],
      address: [null, []],
      phone: [null, []],
      manager: [null, []],
      city_id: [null, []],
    });
    this.formGroup.patchValue({ user_id: this.data.user.id });
    this.formGroup.patchValue({ user_name: this.data.user.name });
    if (this.data.user.type === 2) { //customer
      this.formGroup.patchValue({ name: this.data.user.name });
      this.formGroup.patchValue({ address: this.data.user.name });
      this.formGroup.patchValue({ phone: this.data.phone });
      this.formGroup.patchValue({ manager: this.data.manager });
      this.formGroup.patchValue({ city_id: this.data.city_id });
    } else if (this.data.user.type === 3) { //driver
      this.formGroup.patchValue({ name: this.data.user.name });
      this.formGroup.patchValue({ phone: this.data.phone });
    }
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
  
      this.apiService.postApi('/logistics/editUser', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_edit_user'));
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
