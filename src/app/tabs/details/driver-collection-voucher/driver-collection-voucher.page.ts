import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowQrPopoverComponent } from 'src/app/popovers/show-qr-popover/show-qr-popover.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PrintPaymentService } from 'src/app/services/print-payment.service';

@Component({
  selector: 'app-driver-collection-voucher',
  templateUrl: './driver-collection-voucher.page.html',
  styleUrls: ['./driver-collection-voucher.page.scss'],
})
export class DriverCollectionVoucherPage implements OnInit {
  data: any;

  userType: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private callNumber: CallNumber,
    private printPaymentService: PrintPaymentService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translatePipe: TranslatePipe
  ) {
    this.userType = this.authService.user.type;
  }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.data = this.route.snapshot.data['data'];
    } else {
      this.router.navigateByUrl('/tabs/drivers-collection', { replaceUrl: true });
    }
  }

  async showQR() {
    const pop = await this.popoverController.create({
      component: ShowQrPopoverComponent,
      componentProps: { qrData: this.data.oid },
      cssClass: 'popover-content',
      mode: 'ios'
    });
    return await pop.present();
  }
  
  makeCall(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
