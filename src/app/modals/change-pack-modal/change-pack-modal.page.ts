import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-pack-modal',
  templateUrl: './change-pack-modal.page.html',
  styleUrls: ['./change-pack-modal.page.scss'],
})
export class ChangePackModalPage implements OnInit {
  formGroup: FormGroup;
  newPackData: any;
  newPackages: any;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private translatePipe: TranslatePipe,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController
  ) {
    this.newPackData = JSON.parse(JSON.stringify(this.navParams.data.packData));
    this.newPackages = JSON.parse(JSON.stringify(this.navParams.data.packages));
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      id: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      packages_cost: [null, []],
      notes: [null, []]
    });
    this.formGroup.patchValue({ id: this.newPackData.id });
    this.formGroup.patchValue({ amount: this.newPackData.amount });
    this.setAmount(this.newPackData.amount);
  }

  
  close() {
    this.modalController.dismiss();
  }

  setAmount(value) {
    let index = this.newPackages.findIndex(pack => pack.id === this.newPackData.id);

    this.newPackages[index].amount = Math.round(value * 100) / 100;
    this.newPackages[index].total = this.newPackages[index].quantity * this.newPackages[index].amount;
    let sumTotal = this.newPackages.map(a => a.total).reduce(function (a, b) {
      return a + b;
    }, 0);
    sumTotal = Math.round(sumTotal * 100) / 100;
    
    this.formGroup.patchValue({ packages_cost: sumTotal });
  }

  changeAmount(event) {
    let index = this.newPackages.findIndex(pack => pack.id === this.newPackData.id);

    this.newPackages[index].amount = Math.round(event.target.value * 100) / 100;
    this.newPackages[index].total = this.newPackages[index].quantity * this.newPackages[index].amount;
    let sumTotal = this.newPackages.map(a => a.total).reduce(function (a, b) {
      return a + b;
    }, 0);
    sumTotal = Math.round(sumTotal * 100) / 100;
    
    this.formGroup.patchValue({ packages_cost: sumTotal });
  }

  async save() {
    if (this.formGroup.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();
  
      this.apiService.postApi('/logistics/editPackage', this.formGroup.value).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_edit_pack'));
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
