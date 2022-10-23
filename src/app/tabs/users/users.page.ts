import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, LoadingController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, ViewWillEnter {

  users: any;
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
    this.apiService.getApi(refresh, 'my-users', '/logistics/getMyUsers', {company_id: this.authService.companyId()}).subscribe(async (res: any) => {
      this.users = res;
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  async changeActive(event, user) {
    this.apiService.postApi('/logistics/changeUserStatus',{ 'user_id': user.id, 'active': event.detail.checked }).subscribe(
      (res: any) => {
        if (!res.success) {
          console.log('not success');
        }
      }, async (error) => {
        console.log('error', 'error')
      }
    );
  }

}
