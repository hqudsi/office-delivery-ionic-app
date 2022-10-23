import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidEnter, IonContent, LoadingController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-finance-changes',
  templateUrl: './finance-changes.page.html',
  styleUrls: ['./finance-changes.page.scss'],
})
export class FinanceChangesPage implements OnInit, ViewDidEnter {
  @ViewChild(IonContent) content: IonContent;

  showIfinite = true;

  top: number = 0;
  
  vouchers: any[] = [];
  vouchersCollection: any;
  approxItemHeight: string = '48px';
  

  userType: any;
  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private dataService: DataService,
    private router: Router,
    private plt: Platform,
    private renderer: Renderer2
    ) {
      if (this.plt.is('ios')) {
        this.approxItemHeight = '44px';
      }
      this.userType = this.authService.user.type;
    }

  ngOnInit() {
    let element: any = document.getElementById('main-content');
    this.renderer.setStyle(element, 'top', "0px");
    for (let c of element.children) {
      this.renderer.setStyle(c, 'opacity', 1);
    }

  }

  ionViewDidEnter() {
    this.showIfinite = true;
    
    this.loadData(true);
  }

  logScrolling(event) {
    this.top = event.detail.scrollTop;
  }
  
  scrollToTop() {
    this.content.scrollToTop(this.top);
  }

  async loadData(refresh = false, refresher?) {
    this.showIfinite = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    if (!refresher) {
      await loading.present();
    }
    let dataRequest: any;
    dataRequest =  {
      'company_id': this.authService.companyId()
    };
    this.apiService.getApi(refresh, 'pack-changes', '/logistics/getPackChange', dataRequest).subscribe(async (res: any) => {
      this.vouchersCollection = res;
      this.vouchers = res.data;
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  loadMoreItems(event) {
    let page = this.vouchersCollection.current_page + 1;
    let dataRequest: any;
    dataRequest =  {
      'company_id': this.authService.companyId(),
      'page': page 
    };

    if (page > this.vouchersCollection.last_page) {
      this.showIfinite = false;
    } else {
      this.apiService.getApi(true, 'my-drivers-collection', '/logistics/getPackChange', dataRequest).subscribe(async (res: any) => {
        if (res) {
          this.vouchersCollection = res;
          if (this.vouchers) {
            this.vouchers = this.vouchers.concat(res.data);
          } else {
            this.vouchers = res.data;
          }
          event.target.complete();
          if (page === this.vouchersCollection.last_page) {
            this.showIfinite = false;
          } else {
            this.showIfinite = true;
          }
        }
      });
    }
  }

  showDetails(voucher) {
    this.showIfinite = true;
    this.dataService.setData(voucher.id, voucher);
    this.router.navigate(['/tabs/details/driver-collection-voucher/' + voucher.id], {replaceUrl: true});
  }

  myHeaderFn(record, recordIndex, records) {
    if (recordIndex % 20 === 0) {
      return 'Header ' + recordIndex;
    }
    return null;
  }

}
