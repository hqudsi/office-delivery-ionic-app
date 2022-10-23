import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-add-receipt-modal',
  templateUrl: './add-receipt-modal.page.html',
  styleUrls: ['./add-receipt-modal.page.scss'],
})
export class AddReceiptModalPage implements OnInit {
  balance: number;
  customers: any; 
  formGroup: FormGroup;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private translatePipe: TranslatePipe
  ) {
    this.customers = this.navParams.data.customers;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      amount: [null, [Validators.required]],
      company_id: [null, [Validators.required]],
      customer_id: [null, [Validators.required]],
      manual_number: [null, [Validators.required]],
      balance: [null]
    });
    this.formGroup.patchValue({ company_id: this.authService.companyId() });
  }

  close() {
    this.modalController.dismiss();
  }

  onCustomerChange(event) {
    let obj = this.customers.find(o => o.customer.id === event.target.value);
    this.balance = obj.collection;
    this.formGroup.patchValue({ balance: obj.collection });
  }

  async save() {
    if (this.formGroup.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();

      this.apiService.postApi('/logistics/addReceipt', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_receipt'));
              this.modalController.dismiss(res.data);
            } else {
              if (res.status == 'has_manual_number') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'),this.translatePipe.transform('ALERTS.has_manual_number'));
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

  async showAlert(title, message) {

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

}
