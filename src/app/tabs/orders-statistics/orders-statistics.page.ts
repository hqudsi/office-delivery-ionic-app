import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, LoadingController, ViewWillEnter } from '@ionic/angular';
import { stat } from 'fs';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-orders-statistics',
  templateUrl: './orders-statistics.page.html',
  styleUrls: ['./orders-statistics.page.scss'],
})
export class OrdersStatisticsPage implements OnInit, ViewWillEnter {
  @ViewChild(IonContent) content: IonContent;
  statistics: any;
  userType: any;
  constructor(private apiService: ApiService,
    private loadingController: LoadingController,
    private dataService: DataService,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthenticationService
    ) {
      this.userType = this.authService.user.type;
    }

  ngOnInit() {
    // this.loadData(false);
    let element: any = document.getElementById('main-content');
    this.renderer.setStyle(element, 'top', "0px");
    for (let c of element.children) {
      this.renderer.setStyle(c, 'opacity', 1);
    }
  }
  
  ionViewWillEnter() {
    this.statistics = null;
    this.loadData(true);
    this.content.scrollToTop(0);
  }

  async loadData(refresh = false, refresher?) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    // if (!refresher) {
    //   await loading.present();
    // }
    this.apiService.getApi(refresh, 'my-orders-statistics', '/logistics/getMyOrdersStatistics').subscribe(async (res: any) => {
      this.statistics = res;
      // if (!refresher) {
      //   await loading.dismiss();
      // }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  showDetails(status) {
    this.dataService.setData(status, {status_multi: [status]});
    this.router.navigate(['/tabs/orders/' + status]);
    // , {replaceUrl: true}
  }

}
