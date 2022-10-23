import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.page.html',
  styleUrls: ['./reset-password-modal.page.scss'],
})
export class ResetPasswordModalPage {

  email: any = '';

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private translatePipe: TranslatePipe,
    private alertController: AlertController
  ) { }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.apiService.postApi('/recover-email', { 'email': this.email }).subscribe(
      async (res: any) => {
        await loading.dismiss();
        if (res) {
          if (res.success) {
            this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.reset_password_link_sent'));
            this.modalController.dismiss();
          } else {
            if (res.status == 'email_not_found') {
              this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.email_not_found'));
            } else {
              this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
              this.modalController.dismiss();
            }
          }
        }
      }, async (error) => {
        await loading.dismiss();
        this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
      }
    );
    // this.modalController.dismiss({event: this.event});
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
