import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TemplateReportService } from 'src/app/services/template-report.service';

@Component({
  selector: 'app-customer-orders-report',
  templateUrl: './customer-orders-report.page.html',
  styleUrls: ['./customer-orders-report.page.scss'],
})
export class CustomerOrdersReportPage implements OnInit {

  customers: any;
  cities: any;
  statuses: any;
  formGroup: FormGroup;
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private templateReport: TemplateReportService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      city_id: [null, []],
      customer_id: [null, []],
      from_date: [null, []],
      to_date: [null, []],
      company_id: [null, []],
      status_multi: [null, []],
      financial_status_multi: [null, []]
    });
    this.loadData();
    this.formGroup.patchValue({ company_id: this.authService.companyId() });
    this.formGroup.patchValue({ from_date: this.formatDate(new Date()) });
    this.formGroup.patchValue({ to_date: this.formatDate(new Date()) });

  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  loadData() {
    this.apiService.getApi(true, 'cities', '/getCities').subscribe(async (res: any) => {
      this.cities = res;
    });
    this.apiService.getApi(true, 'my-customers', '/logistics/getMyCustomers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
      this.customers = res;
    });
    this.apiService.getApi(true, 'system-statuses', '/logistics/getStatuses').subscribe(async (res: any) => {
      this.statuses = res;
    });
  }

  changeStatus(event) {
    if (event.detail.value.length) {
      this.formGroup.patchValue({ status_multi: event.detail.value });
    } else {
      this.formGroup.patchValue({ status_multi: null });
    }
  }

  changeFinancialStatus(event) {
    if (event.detail.value.length) {
      this.formGroup.patchValue({ financial_status_multi: event.detail.value });
    } else {
      this.formGroup.patchValue({ financial_status_multi: null });
    }
  }

  async save() {
    this.formGroup.patchValue({ from_date: this.formatDate(this.formGroup.value.from_date) });
    this.formGroup.patchValue({ to_date: this.formatDate(this.formGroup.value.to_date) });
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class-1',
      mode: 'md'
    });
    await loading.present();

    this.apiService.postApi('/logistics/getCustomerOrdersReport', this.formGroup.value).subscribe(async (res: any) => {
      
      let newData = this.groupBy(res.orders, "customer_id");
      let colmuns = [
        {arabicTitle: 'القيمة', propertyName: 'packages_cost', hasSub: true, subProperty: 'order_costs', type: 'value'},
        {arabicTitle: 'المدينة', propertyName: 'name', hasSub: true, subProperty: 'to', type: 'string'},
        {arabicTitle: 'المستلم', propertyName: 'end_customer_name', hasSub: false, type: 'string'},
        {arabicTitle: 'التاريخ', propertyName: 'created_at', hasSub: false, type: 'date'},
        {arabicTitle: 'الرقم', propertyName: 'oid', hasSub: false, type: 'value'}
      ];
      // startReport(reportTitle, headerData, groupBy, groupByTitle, colmuns, data, pageOrientation, accumulate); // 'landscape', 'portrait'
      let filterString = 'تصفية';
      await this.templateReport.startReport(filterString, 'تقرير طلبيات الموردين', res.company, 'customer', 'المورد: ', colmuns, newData, 'portrait', 'packages_cost');
      await loading.dismiss();
    });
  }

  groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

  close() {
    this.modalController.dismiss();
  }

}
