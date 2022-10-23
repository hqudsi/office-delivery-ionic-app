import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit, ViewWillEnter {
  @ViewChild(IonContent) content: IonContent;

  userType: any;
  statistics: any;
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) { 
    this.userType = authService.user.type;
  }

  ngOnInit() {
    // this.loadData(false);
  }
  
  
  ionViewWillEnter() {
    this.statistics = null;
    this.loadData(true);
  }

  scrollToTop() {
    this.content.scrollToTop(0);
  }

  async loadData(refresh = false, refresher?) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    this.apiService.getApi(refresh, 'my-collection-statistics', '/logistics/getMyCollectionStatistics').subscribe(async (res: any) => {
      this.statistics = res;
      if (refresher) {
        refresher.target.complete();
      }
    });
  }
}
