import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform, ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, ViewWillEnter {

  customers: any;
  userType: any;
  approxItemHeight: string = '48px';
  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    public plt: Platform,
    private dataService: DataService,
    private router: Router
  ) {
    this.userType = authService.user.type;
    if (this.plt.is('ios')) {
      this.approxItemHeight = '44px';
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData(true);
  }

  async loadData(refresh = false, refresher?) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    if (!refresher) {
      await loading.present();
    }
    this.apiService.getApi(refresh, 'my-customers', '/logistics/getMyCustomers', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      this.customers = res;
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  async showDetails(customer) {
    if (this.userType == 1 || this.userType == 5) {
      this.dataService.setData(customer.id, customer);
      this.router.navigate(['/tabs/details/user/' + customer.id]);
    }
  }

}
