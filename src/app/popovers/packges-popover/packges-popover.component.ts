import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams, PopoverController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ChangePackModalPage } from 'src/app/modals/change-pack-modal/change-pack-modal.page';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-packges-popover',
  templateUrl: './packges-popover.component.html',
  styleUrls: ['./packges-popover.component.scss'],
})
export class PackgesPopoverComponent {
  packages: any;
  order: any;
  canEdit: any;
  userType: any;
  constructor(
    private popover: PopoverController, 
    private navParams:NavParams,
    private alertController: AlertController,
    private translatePipe: TranslatePipe,
    private modalController: ModalController,
    private authService: AuthenticationService
    ) {
    this.packages = this.navParams.data.packages;
    this.order = this.navParams.data.order;
    this.canEdit = this.navParams.data.canEdit;
    this.userType = authService.user.type;
  }

  closePopover() {
    this.popover.dismiss(this.order);
  }

  async showAlert(message) {
    
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('MODAL.notes'),
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

  async changePack(packageData) {
    const modal = await this.modalController.create({
      component: ChangePackModalPage,
      componentProps: { 
        packData: packageData,
        order: this.order,
        packages: this.packages
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.packages = result.data.order_details;
        this.order = result.data;
      }
    });
  }

}
