import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-my-customer-modal',
  templateUrl: './add-my-customer-modal.page.html',
  styleUrls: ['./add-my-customer-modal.page.scss'],
})
export class AddMyCustomerModalPage implements OnInit {
  emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileRegex = /^0(5|7)\d{8}$/;

  customer = {
    oid: ''
  };

  newCustomer: number = 1;

  userFG: FormGroup;
  otherFG: FormGroup;
  cities: any;

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
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });
    this.userFG = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    this.otherFG = this.formBuilder.group({
      c_name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      manager: ['', [Validators.required]]
    });
  }
  
  validEmail() {
    let email = this.userFG.value.email;
    return ( this.emailReg.test(email) || ((email.length > 9) && (this.mobileRegex.test(email))) ) ? false : true;
  }

  close() {
    this.modalController.dismiss();
  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      this.customer.oid = barcodeData.text;
    }).catch(err => {
      console.log('Error', 'err');
    });
  }

  async save() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    if (this.newCustomer === 1) {
      this.apiService.postApi('/logistics/addCompanyCustomer', { 'oid': this.customer.oid, 'company_id': this.authService.companyId() }).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_cust'));
              this.modalController.dismiss();
            } else {
              if (res.status == 'no_customer') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.no_customer'));
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
    } else {
      if (this.userFG.valid && this.otherFG.valid) {
        let dataRequest = {
          ...this.userFG.value,
          ...this.otherFG.value,
          ...{system: 2},
          ...{company_id: this.authService.companyId()}
        };

        this.apiService.postApi('/logistics/addNewCompanyCustomer', dataRequest).subscribe(
          async (res: any) => {
            await loading.dismiss();
            if (res) {
              if (res.success) {
                this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_cust'));
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
        this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
      }
    }
    // this.modalController.dismiss({event: this.event});
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
