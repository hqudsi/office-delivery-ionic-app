import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, PopoverController, ViewDidEnter } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ChangePasswordModalPage } from 'src/app/modals/change-password-modal/change-password-modal.page';
import { ShowQrPopoverComponent } from 'src/app/popovers/show-qr-popover/show-qr-popover.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, ViewDidEnter {
  storageUrl = environment.StorageUrl;
  userData: any;
  userDetails: any;

  constructor(
    private authService: AuthenticationService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private apiService: ApiService,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private loadingController: LoadingController,
    private router: Router
    ) { }

  ngOnInit() {
    this.userData = this.authService.user;
    this.userDetails = this.authService.userDetails;
  }

  ionViewDidEnter() {
    this.apiService.getApi(true, 'userData', '/getUser').subscribe(async (res: any) => {
      this.userData = res.user;
      this.userDetails = res.userDetails;
      this.authService.updateUserData(res);
    });
  }

  async showQR() {
    const pop = await this.popoverController.create({
      component: ShowQrPopoverComponent,
      componentProps: { qrData: this.userDetails.oid },
      cssClass: 'popover-content',
      mode: 'ios'
    });
    return await pop.present();
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
  }

  async deleteAccount() {
    const confirmData = await this.confirmationAlert();
    console.log(confirmData);
    if (confirmData) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class-1'
          });
          await loading.present();
          this.apiService.postApi('/deleteAccount', { 'email': this.userData.email, 'password':  confirmData.password}).subscribe(
            async (res: any) => {
                console.log(res);
              await loading.dismiss();
              if (res) {
                if (res.success) {
                  this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done'));
                  this.modalController.dismiss();
                  await this.authService.logout();
                  this.apiService.clearStorage();
                  this.router.navigateByUrl('/', { replaceUrl: true });
                } else {
                    this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
                    this.modalController.dismiss();
                }
              }        
            }, async (error) => {
              await loading.dismiss();
              this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
            }
          );
    }
  }

  private async confirmationAlert(): Promise<any> {
    let resolveFunction: (confirm: any) => void;
    const promise = new Promise<any>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('ALERTS.delete_confirmation'),
      message: this.translatePipe.transform("ALERTS.delete_confirmation_desc"),
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'password',
          type: 'text',
          id: 'password',
          placeholder: this.translatePipe.transform("REGISTER.confirm_password")
        }
    ],
      buttons: [
        {
          text: this.translatePipe.transform('no'),
          handler: () => resolveFunction(false)
        },
        {
          text: this.translatePipe.transform('yes'),
          handler: (data) => resolveFunction(data)
        }
      ]
    });
    await alert.present();
    return promise;
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
