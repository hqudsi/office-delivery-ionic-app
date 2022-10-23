import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { AddCityModalPage } from 'src/app/modals/add-city-modal/add-city-modal.page';
import { AddMyCustomerModalPage } from 'src/app/modals/add-my-customer-modal/add-my-customer-modal.page';
import { AddReceiptModalPage } from 'src/app/modals/add-receipt-modal/add-receipt-modal.page';
import { AddUserModalPage } from 'src/app/modals/add-user-modal/add-user-modal.page';
import { CustomerPaymentModalPage } from 'src/app/modals/customer-payment-modal/customer-payment-modal.page';
import { DriverCollectionVoucherModalPage } from 'src/app/modals/driver-collection-voucher-modal/driver-collection-voucher-modal.page';
import { LoadingOrdersModalPage } from 'src/app/modals/loading-orders-modal/loading-orders-modal.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-add-popover',
  templateUrl: './add-popover.component.html',
  styleUrls: ['./add-popover.component.scss'],
})
export class AddPopoverComponent {

  userType: any;
  constructor (
    private popover: PopoverController,
    private modalController: ModalController,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private dataService: DataService,
    private router: Router
  ) {
    this.userType = authService.user.type;
  }

  closePopover() {
    this.popover.dismiss();
  }

  async addMyCustomer() {
    this.popover.dismiss();
    const modal = await this.modalController.create({
      component: AddMyCustomerModalPage,
      cssClass: 'customer-modal',
      backdropDismiss: true,
      mode: 'ios'
    });
    await modal.present();
  }

  async addNewUser() {
    this.popover.dismiss();
    const modal = await this.modalController.create({
      component: AddUserModalPage,
      cssClass: 'customer-modal',
      backdropDismiss: true,
      mode: 'ios'
    });
    await modal.present();
  }

  async addReceipt() {
    this.popover.dismiss();
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.apiService.getApi(true, 'my-customers', '/logistics/getMyCustomersWithCollection', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      const modal = await this.modalController.create({
        component: AddReceiptModalPage,
        componentProps: {customers: res},
        cssClass: 'cal-modal',
        backdropDismiss: true
      });
      await loading.dismiss();
      await modal.present();
    });

  }

  async addCity() {
    this.popover.dismiss();
    const modal = await this.modalController.create({
      component: AddCityModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
  }

  async loadingOrders() {
    this.popover.dismiss();
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.apiService.getApi(true, 'my-loading-orders', '/logistics/getLoadingOrders', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      const modal = await this.modalController.create({
        component: LoadingOrdersModalPage,
        componentProps: {orders: res},
        cssClass: 'cal-modal',
        backdropDismiss: true
      });
      await loading.dismiss();
      await modal.present();
    });

    
  }

  async driverCollectionVoucher() {
    this.popover.dismiss();
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      const modal = await this.modalController.create({
        component: DriverCollectionVoucherModalPage,
        componentProps: {drivers: res},
        cssClass: 'customer-modal',
        backdropDismiss: true
      });
      await loading.dismiss();
      await modal.present();
    });
  }

  async companyPaymentVoucher() {
    this.popover.dismiss();
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();
    this.apiService.getApi(true, 'my-customers', '/logistics/getMyCustomers', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      const modal = await this.modalController.create({
        component: CustomerPaymentModalPage,
        componentProps: {customers: res},
        cssClass: 'customer-modal',
        backdropDismiss: true
      });
      await loading.dismiss();
      await modal.present();
      modal.onDidDismiss().then((result) => {
        if (result.data) {
          this.dataService.setData(result.data.id, result.data);
          this.router.navigate(['/tabs/details/customer-payment/' + result.data.id], {replaceUrl: true});
        }
      });
    });
  }

}
