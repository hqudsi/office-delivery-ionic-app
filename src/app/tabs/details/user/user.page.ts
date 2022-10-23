import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { EditUserModalPage } from 'src/app/modals/edit-user-modal/edit-user-modal.page';
import { ShowQrPopoverComponent } from 'src/app/popovers/show-qr-popover/show-qr-popover.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  data: any;
  ordersData: any;
  currenctLanguage: String = '';
  customerCollection: any;
  driverCollection: any;
  cities: any;
  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dataService: DataService,
    private authService: AuthenticationService,
    private callNumber: CallNumber,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.loadCity();
      this.data = this.route.snapshot.data['data'];
      this.loadStatistics(true, this.data.user);
      this.loadUserCollection();
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  loadCity() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });
  }

  loadStatistics(refresh = true, user) {
    this.apiService.getApi(refresh, 'user-' + user.id + '-orders-statistics', '/logistics/getUserOrdersStatistics', { 'userId': user.id, 'userType': user.type }).subscribe(async (res: any) => {
      this.ordersData = res;
    });
  }

  loadUserCollection() {
    this.apiService.getApi(true, 'my-customer-' + this.data.id + '-collectoin', '/logistics/getMyCustomerCollection', { company_id: this.authService.companyId(), customer_id: this.data.id }).subscribe(
      async (res: any) => {
        
        if (res) {
          this.customerCollection = res;
        }
      }, async (error) => {
        console.log('error');
      }
    );

    this.apiService.getApi(true, 'my-driver-' + this.data.id + '-collectoin', '/logistics/getMyDriverCollection', { user_id: this.data.user.id, driver_id: this.data.id }).subscribe(
      async (res: any) => {
        
        if (res) {
          this.driverCollection = res;
        }
      }, async (error) => {
        console.log('error');
      }
      );
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

  async showFinance() {
    if (this.data.user.type == 3) {
      // ------------------- driver
      this.dataService.setData(this.data.id, this.driverCollection);
      this.router.navigate(['/tabs/details/driver-collection/' + this.data.id]);
      // const loading = await this.loadingController.create({
      //   cssClass: 'my-custom-class-1',
      //   mode: 'md'
      // });
      // await loading.present();
      // this.apiService.getApi(true, 'my-driver-' + this.data.id + '-collectoin', '/logistics/getMyDriverCollection', { user_id: this.data.user.id, driver_id: this.data.id }).subscribe(async (res: any) => {
      //   if (res) {
          
      //   }
      //   await loading.dismiss();
      // });
    } else if (this.data.user.type == 2) {
      // ------------------- Customer
      this.dataService.setData(this.data.id, this.customerCollection);
      this.router.navigate(['/tabs/details/account-statement/' + this.data.id]);
    }

  }

  async changeActive(event, user) {
    this.apiService.postApi('/logistics/changeDriverStatus',{ 'user_id': user.id, 'active': event.detail.checked }).subscribe(
      (res: any) => {
        if (!res.success) {
          console.log('not success');
        }
      }, async (error) => {
        console.log('error', 'error')
      }
    );
  }

  makeCall(number) {
    this.callNumber.callNumber(number, true)
    .then(res => console.log('Launched dialer!'))
    .catch(err => console.log('Error launching dialer'));
  }

  async editUser() {
    const modal = await this.modalController.create({
      component: EditUserModalPage,
      componentProps: {
        data: this.data,
        cities: this.cities
      },
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.data = result.data;
      }
    });
  }

}
