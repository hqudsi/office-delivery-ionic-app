import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data/data.service';

interface User {
  id: number;
  first: string;
  last: string;
}

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {

  user: any;
  userDetails: any;

  customers: any;
  companies: any;
  drivers: any;
  statuses: any;

  cities: any;
  packSizes: any;

  headerFG: FormGroup;
  itemFG: FormGroup;
  paymentFG: FormGroup;
  reviewFG: FormGroup;
  categories: any;
  currenctSegment: string = "orderHeader";
  currenctIndex: number = 0;

  packages = [];
  reviewArray = [
    { 'title': '', 'value': null }
  ];

  minDate: any;
  maxDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private dataService: DataService,
    private router: Router,
    private translatePipe: TranslatePipe
  ) {
    this.user = authService.user;
    this.userDetails = authService.userDetails;
    this.minDate = new Date().toISOString().slice(0, 10);
    this.maxDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10);
    this.loadFilterData();
  }

  ngOnInit() {
    this.loadData(true);
    this.headerFG = this.formBuilder.group({
      customer: [null, [Validators.required]],
      company: [null, [Validators.required]],
      driver: [null, []],
      end_customer_name: ['', [Validators.required]],
      to: ['', [Validators.required]],
      end_customer_address: ['', [Validators.required]],
      end_customer_phone: ['', [Validators.required]],
      due_date: [null, []],
      manual_number: [null, []],
      notes: ['', []]
    });

    this.itemFG = this.formBuilder.group({
      total: [0, [Validators.required]],
      packages_count: [null, [Validators.required, Validators.min(1)]]
    });

    this.paymentFG = this.formBuilder.group({
      pay_on_delivery: ['1', [Validators.required]],
      who_pays: ['2', [Validators.required]],
      trans_cost: ['', [Validators.required]],
      packages_count: [null, [Validators.required]],
      packages_cost: [null, [Validators.required]],
    });

    this.reviewFG = this.formBuilder.group({
      done: [null, [Validators.required]]
    });

    this.categories = [
      { "id": 0, "key": "orderHeader", "label": "ORDER.segments.header", "icon": "ellipse-outline", "iconColor": "primary", "formGroup": this.headerFG },
      { "id": 1, "key": "orderItems", "label": "ORDER.segments.items", "icon": "ellipse-outline", "iconColor": "primary", "formGroup": this.itemFG },
      { "id": 2, "key": "orderPayment", "label": "ORDER.segments.payment", "icon": "ellipse-outline", "iconColor": "primary", "formGroup": this.paymentFG },
      { "id": 3, "key": "orderReview", "label": "ORDER.segments.review", "icon": "ellipse-outline", "iconColor": "primary", "formGroup": this.reviewFG }
    ]

    if (this.user.type === 1 || this.user.type === 4) {
      this.headerFG.controls['company'].setValue(this.authService.companyId());
    } else if (this.user.type === 2) {
      this.headerFG.controls['customer'].setValue(this.userDetails.id);
    } 
    // else if (this.user.type === 3) {
    //   this.headerFG.controls['company'].setValue(this.authService.companyId());
    //   this.headerFG.controls['driver'].setValue(this.userDetails.id);
    // }
  }

  loadFilterData() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });
    this.apiService.getApi(true, 'system-statuses', '/logistics/getStatuses').subscribe(async (res: any) => {
      this.statuses = res;
    });
  }

  loadData(refresh = true) {
    if (this.user.type === 1 || this.user.type === 4) {
      this.apiService.getApi(refresh, 'my-customers', '/logistics/getMyCustomers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
        this.customers = res;
      });
    } else if (this.user.type === 2) {
      this.apiService.getApi(refresh, 'my-compaies', '/logistics/getMyCompanies', { customer_id: this.userDetails.id }).subscribe(async (res: any) => {
        this.companies = res;
        this.headerFG.controls['company'].setValue(this.companies[0].id);
      });

    }

    // this.apiService.getApi(refresh, 'cities', '/getCities').subscribe(async (res: any) => {
    //   this.cities = res;
    // });

    this.apiService.getApi(refresh, 'pack-sizes', '/logistics/getPackSizes').subscribe(async (res: any) => {
      this.packSizes = res;
    });
  }

  clear() {
    
  }

  changeSegment(key) {
    let indexCurrentObj = this.categories.findIndex(element => element.key == this.currenctSegment);
    let indexNewObj = this.categories.findIndex(element => element.key == key);
    if (this.categories[indexCurrentObj].formGroup.valid) {
      this.categories[indexCurrentObj].icon = "checkmark-circle";
      this.categories[indexCurrentObj].iconColor = "success";
    } else {
      this.categories[indexCurrentObj].icon = "alert-circle";
      this.categories[indexCurrentObj].iconColor = "danger";
    }
    this.currenctSegment = key;
    this.currenctIndex = indexNewObj;
    if (this.headerFG.valid && this.itemFG.valid && this.paymentFG.valid) {
      this.reviewFG.setValue({ done: true });
    } else {
      this.reviewFG.setValue({ done: null });
    }
  }

  nextSegment() {
    let newIndex = this.currenctIndex + 1;
    let newSegment = this.categories[newIndex].key;
    this.changeSegment(newSegment);
    if (this.headerFG.valid && this.itemFG.valid && this.paymentFG.valid) {
      this.reviewFG.setValue({ done: true });
    } else {
      this.reviewFG.setValue({ done: null });
    }
  }

  previousSegment() {
    let newIndex = this.currenctIndex - 1;
    let newSegment = this.categories[newIndex].key;
    this.changeSegment(newSegment);
    if (this.headerFG.valid && this.itemFG.valid && this.paymentFG.valid) {
      this.reviewFG.setValue({ done: true });
    } else {
      this.reviewFG.setValue({ done: null });
    }
  }

  addPackage() {
    this.packages.push({ service: 2, pack_size: 1, quantity: null, price: null, total: null, notes: '' });
  }

  changePackage(index) {
    this.packages[index].total = this.packages[index].quantity * this.packages[index].price;
    let sumTotal = this.packages.map(a => a.total).reduce(function (a, b) {
      return a + b;
    }, 0);
    sumTotal = Math.round(sumTotal * 100) / 100;
    this.itemFG.setValue({
      total: sumTotal, packages_count: this.packages.map(a => a.quantity).reduce(function (a, b) {
        return a + b;
      }, 0)
    });
    this.paymentFG.patchValue({ packages_cost: sumTotal });
    this.paymentFG.patchValue({
      packages_count: this.packages.map(a => a.quantity).reduce(function (a, b) {
        return a + b;
      }, 0)
    });
  }

  changeCompany() {
    this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', { company_id: this.headerFG.value.company }).subscribe(async (res: any) => {
      this.drivers = res;
    });
  }

  deletePackage(index) {
    this.packages.splice(index, 1);
    let sumTotal = this.packages.map(a => a.total).reduce(function (a, b) {
      return a + b;
    }, 0);
    this.itemFG.setValue({
      total: sumTotal, packages_count: this.packages.map(a => a.quantity).reduce(function (a, b) {
        return a + b;
      }, 0)
    });
    this.paymentFG.patchValue({ packages_cost: sumTotal });
    this.paymentFG.patchValue({
      packages_count: this.packages.map(a => a.quantity).reduce(function (a, b) {
        return a + b;
      }, 0)
    });
  }

  async approve() {
    if (this.headerFG.valid && this.itemFG.valid && this.paymentFG.valid) {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class-1',
        mode: 'md'
      });
      await loading.present();
      let dataRequest = this.headerFG.value;
      dataRequest.system = this.authService.user.system_id;
      dataRequest.details = this.packages;
      dataRequest.costs = this.paymentFG.value;
      dataRequest.due_date = dataRequest.due_date ? dataRequest.due_date.split('T')[0] : null;
      this.apiService.postApi('/logistics/addOrder', dataRequest).subscribe(
        async (res: any) => {
          await loading.dismiss();
          if (res) {
            if (res.success) {
              this.showAlert(this.translatePipe.transform('ALERTS.done'), this.translatePipe.transform('ALERTS.done_add_order'));
              let filterData = {
                order_id: null,
                cities: this.cities,
                city_id: null,
                status_multi: null,
                financial_status_multi: null,
                from_date: null,
                to_date: null,
                drivers: this.drivers,
                driver_id: null,
                customers: this.customers,
                customer_id: null,
                end_customer_name: null
              };
              this.dataService.setData(res.order.id, {order: res.order, filterData: filterData});
              this.router.navigate(['/tabs/details/order/' + res.order.id], { replaceUrl: true });
            } else {
              if (res.status == 'validator_fails') {
                this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
              } else {
                this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
              }
            }
          }
        }, async (error) => {
          await loading.dismiss();
          
          this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.try_again'));
        }
      );
    } else {
      this.showAlert(this.translatePipe.transform('ALERTS.error'), this.translatePipe.transform('ALERTS.check_data'));
    }

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
