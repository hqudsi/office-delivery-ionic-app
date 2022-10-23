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
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.page.html',
  styleUrls: ['./customer-payment.page.scss'],
})
export class CustomerPaymentPage implements OnInit {
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
      this.router.navigateByUrl('/tabs/customer-payments', { replaceUrl: true });
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

  async changeStatus() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.apiService.postApi('/logistics/approveCustomerPayment', this.data).subscribe(
      async (res: any) => {
        if (res.success) {
            this.data.post = 1;
            this.data.customerPayment = res.data.post_date;
            this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.post_voucher_success'));
          } else {
            console.log('error change status');  
            this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
          }
          await loading.dismiss();
        }, async (error) => {
          console.log('error change status');
          this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
      }
    );
  }
  
  makeCall(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  print() {
    this.printPaymentService.changeFont(this.data);
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
