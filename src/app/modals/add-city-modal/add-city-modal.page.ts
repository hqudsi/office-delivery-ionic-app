import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-add-city-modal',
  templateUrl: './add-city-modal.page.html',
  styleUrls: ['./add-city-modal.page.scss'],
})
export class AddCityModalPage {

  city = {
    name: ''
  };

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translatePipe: TranslatePipe
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

    this.apiService.postApi('/logistics/addCity', { 'name': this.city.name }).subscribe(
      async (res: any) => {
        await loading.dismiss();
        if (res) {
          if (res.success) {
            this.showAlert(this.translatePipe.transform('ALERTS.done'),this.translatePipe.transform('ALERTS.done_add_city'));
            this.modalController.dismiss();
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
