import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-customers-finance',
  templateUrl: './customers-finance.page.html',
  styleUrls: ['./customers-finance.page.scss'],
})
export class CustomersFinancePage implements OnInit, ViewWillEnter {

  userType: any;
  userTypeText: any;
  userId: any;
  data: any;
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private router: Router,
    private dataService: DataService
  ) {
    this.userType = authService.user.type;
    this.userId = authService.userDetails.id;
    this.userTypeText = authService.userTypeText();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.data = null;
    this.loadData(true);
  }

  showDetails(data) {
    if (this.userType == 2) {
      this.dataService.setData(data.company.id, data);
      this.router.navigate(['/tabs/details/account-statement/' + data.company.id]);
    } else {
      this.dataService.setData(data.customer.id, data);
      this.router.navigate(['/tabs/details/account-statement/' + data.customer.id]);
    }
  }

  async loadData(refresh = false, refresher?) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    if (!refresher) {
      await loading.present();
    }
    this.apiService.getApi(refresh, 'my-companies-collection', '/logistics/getMyCompaniesCollection', {'user_type': this.userTypeText, 'user_id': this.userId}).subscribe(async (res: any) => {
      this.data = res;
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

}
