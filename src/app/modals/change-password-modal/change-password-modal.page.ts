import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.page.html',
  styleUrls: ['./change-password-modal.page.scss'],
})
export class ChangePasswordModalPage implements OnInit {

  userFG: FormGroup;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userFG = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    if (this.userFG.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();
  
      this.apiService.postApi('/changePassword', this.userFG.value).subscribe(
        async (res: any) => {
          
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.change_password_success'));
              this.modalController.dismiss();
            } else {
              if (res.status == 'not_found') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.wrong_password'));
              } else {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
                this.modalController.dismiss();
              }
            }
          }
        }, async (error) => {
          await loading.dismiss();
          this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
          this.modalController.dismiss();
        }
      );
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
    // this.modalController.dismiss({event: this.event});
  }

  get password() {
    return this.userFG.get('password');
  }

  get confirmPassword() {
    return this.userFG.get('confirmPassword');
  }

  get oldPassword() {
    return this.userFG.get('oldPassword');
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
