import { Component } from '@angular/core';
import { AlertController, NavParams, PopoverController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-status-popover',
  templateUrl: './status-popover.component.html',
  styleUrls: ['./status-popover.component.scss'],
  providers: [TranslatePipe]
})
export class StatusPopoverComponent {
  statuses: any;
  orderId: any;
  constructor(private popover: PopoverController,
      private navParams:NavParams,
      private alertController: AlertController,
      private translatePipe: TranslatePipe
    ) {
    this.statuses = this.navParams.data.statuses;
    this.orderId = this.navParams.data.orderId;
  }

  closePopover() {
    this.popover.dismiss();
  }

  orderStatusColor(statusId) {
    if (statusId ==1) {
      return 'dark'; 
    } else if (statusId ==2) {
      return 'tertiary'; 
    } else if (statusId == 3) {
      return 'success'; 
    } else if (statusId == 4) {
      return 'warning'; 
    } else if (statusId == 5) {
      return 'danger'; 
    }
  }

  orderStatusName(statusId) {
    if (statusId ==1) {
      return 'bag-add-outline'; 
    } else if (statusId ==2) {
      return 'bag-handle-outline'; 
    } else if (statusId == 3) {
      return 'bag-check-outline'; 
    } else if (statusId == 4 || statusId == 5) {
      return 'bag-remove-outline'; 
    }
  }

  async showAlert(message) {
    
    const alert = await this.alertController.create({
      header: this.translatePipe.transform('MODAL.notes'),
      message: message,
      buttons: [this.translatePipe.transform('CLOSE')],
    });

    await alert.present();
  }

}
