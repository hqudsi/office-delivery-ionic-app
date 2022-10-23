import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.page.html',
  styleUrls: ['./account-statement.page.scss'],
})
export class AccountStatementPage implements OnInit {

  userType: any;
  data: any;
  transactions: any;
  approxItemHeight: string = '48px';
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private loadingController: LoadingController,
    public plt: Platform
  ) {
    this.userType = authService.user.type;
    if (this.plt.is('ios')) {
      this.approxItemHeight = '44px';
    }
  }

  ngOnInit() {
    if (this.route.snapshot.data['data']) {
      this.data = this.route.snapshot.data['data'];
      this.loadData(true);
    } else {
      this.router.navigateByUrl('/', {replaceUrl: true});
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
    this.apiService.getApi(refresh, 'transactions-'+ this.data.company_id + '-' + this.data.customer_id, '/logistics/getTransactions', {company_id: this.data.company_id, customer_id: this.data.customer_id}).subscribe(async (res: any) => {
      this.transactions = res;
      if (this.transactions) {
        if (this.userType == 2) {
          this.transactions[0].balance = this.data.collection * -1;
          this.transactions[0].amount = this.transactions[0].amount * -1;
          for(let i=1; i<this.transactions.length; i++){
            this.transactions[i].amount = this.transactions[i].amount * -1;
            this.transactions[i].balance = this.transactions[i-1].balance - this.transactions[i-1].amount; //use i instead of 0
          }
        } else {
          this.transactions[0].balance = this.data.collection;
          for(let i=1; i<this.transactions.length; i++){
            this.transactions[i].balance = this.transactions[i-1].balance - this.transactions[i-1].amount; //use i instead of 0
          }
        }
      }
      
      if (!refresher) {
        await loading.dismiss();
      }
      if (refresher) {
        refresher.target.complete();
      }
    });
  }



}
