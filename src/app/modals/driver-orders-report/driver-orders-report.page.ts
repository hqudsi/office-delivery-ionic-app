import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TemplateReportService } from 'src/app/services/template-report.service';

@Component({
  selector: 'app-driver-orders-report',
  templateUrl: './driver-orders-report.page.html',
  styleUrls: ['./driver-orders-report.page.scss'],
})
export class DriverOrdersReportPage implements OnInit {

  drivers: any;
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
      driver_id: [null, []],
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
    this.apiService.getApi(true, 'my-drivers', '/logistics/getMyDrivers', { company_id: this.authService.companyId() }).subscribe(async (res: any) => {
      this.drivers = res;
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

    this.apiService.postApi('/logistics/getDriverOrdersReport', this.formGroup.value).subscribe(async (res: any) => {
      
      // const unique = [...new Set(res.orders.map(item => item.driver))];
      var newData = this.groupBy(res.orders, "driver_id");
      
      let colmuns = [
        {arabicTitle: 'القيمة', propertyName: 'to_collect', hasSub: true, subProperty: 'order_costs', type: 'value'},
        {arabicTitle: 'المدينة', propertyName: 'name', hasSub: true, subProperty: 'to', type: 'string'},
        {arabicTitle: 'المستلم', propertyName: 'end_customer_name', hasSub: false, type: 'string'},
        {arabicTitle: 'التاريخ', propertyName: 'created_at', hasSub: false, type: 'date'},
        // {arabicTitle: 'السائق', propertyName: 'name', hasSub: true, subProperty: 'driver', type: 'string'},
        {arabicTitle: 'الرقم', propertyName: 'oid', hasSub: false, type: 'value'}
      ];
      // startReport(reportTitle, headerData, groupBy, groupByTitle, colmuns, data, pageOrientation, accumulate); // 'landscape', 'portrait'
      let cityString = this.formGroup.value.city_id ? ' ، المدينة: ' + this.cities.find(element => element.id ==this.formGroup.value.city_id).name: '';
      let driverString = this.formGroup.value.driver_id ? ' ، السائق: ' + this.drivers.find(element => element.id ==this.formGroup.value.driver_id).name: '';
      // let statusString = this.formGroup.value.status_multi ? ' ، السائق: ' + this.drivers.find(element => element.id ==this.formGroup.value.status_multi).name: '';
      let filterString = 
                      'التصفية: التاريخ ' + this.formGroup.value.from_date + ') - ('+ this.formGroup.value.to_date
                      + cityString + driverString;
      await this.templateReport.startReport(filterString, 'تقرير طلبيات السائقين', res.company, 'driver', 'السائق: ', colmuns, newData, 'portrait', 'to_collect');
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
