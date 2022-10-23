import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.page.html',
  styleUrls: ['./add-user-modal.page.scss'],
})
export class AddUserModalPage implements OnInit {
  emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileRegex = /^0(5|7)\d{8}$/;

  newUserType: number = 1;

  userFG: FormGroup;
  driverFG: FormGroup;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private barcodeScanner: BarcodeScanner,
    private translatePipe: TranslatePipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userFG = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    this.driverFG = this.formBuilder.group({
      phone: ['', [Validators.required]]
    });
  }

  validEmail() {
    let email = this.userFG.value.email;
    return ( this.emailReg.test(email) || ((email.length > 9) && (this.mobileRegex.test(email))) ) ? false : true;
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    if ((this.userFG.valid && this.newUserType!=3) || (this.userFG.valid && this.driverFG.valid && this.newUserType==3)) {
      let dataRequest: any;
      if (this.newUserType == 3) {
        dataRequest = {
          ...this.userFG.value,
          ...this.driverFG.value,
          ...{type: this.newUserType},
          ...{system: 2},
          ...{company_id: this.authService.companyId()}
        };
      } else {
        dataRequest = {
          ...this.userFG.value,
          ...{type: this.newUserType},
          ...{system: 2},
          ...{company_id: this.authService.companyId()}
        };
      }
      

      this.apiService.postApi('/logistics/addNewCompanyUser', dataRequest).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_user'));
              this.modalController.dismiss();
            } else {
              if (res.status == 'email_used') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.email_used'));
              } else {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
              }
            }
          }
        }, async (error) => {
          await loading.dismiss();
          this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.try_again'));
        }
      );
    } else {
      await loading.dismiss();
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }
  }

  get email() {
    return this.userFG.get('email');
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
