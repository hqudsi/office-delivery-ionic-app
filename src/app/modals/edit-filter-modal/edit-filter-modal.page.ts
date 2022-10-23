import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-filter-modal',
  templateUrl: './edit-filter-modal.page.html',
  styleUrls: ['./edit-filter-modal.page.scss'],
})
export class EditFilterModalPage implements OnInit {
  showOrderId: boolean = false;
  showCity: boolean = false;
  showStatus: boolean = false;
  showStatusMulti: boolean = false;
  showFinancialStatus: boolean = false;
  showFinancialStatusMulti: boolean = false;
  showDate: boolean = false;
  showDriver: boolean = false;
  showCustomer: boolean = false;
  showPost: boolean = false;
  showEndCustomer: boolean = false;

  cities: any;
  city_id: any;
  order_id: any;
  statuses: any;
  status: any;
  status_multi = [];
  financial_status: any;
  financial_status_multi = [];
  from_date: any;
  to_date: any;
  formGroup: FormGroup;
  drivers: any;
  driver_id: any;
  customers: any;
  customer_id: any;
  userType: any;
  end_customer_name: any;
  post: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.userType = authService.user.type;

    this.showCity = this.navParams.data.showCity;
    this.cities = this.navParams.data.cities;
    this.city_id = this.navParams.data.city_id;
    
    this.showStatus = this.navParams.data.showStatus;
    this.statuses = this.navParams.data.statuses;
    this.status = this.navParams.data.status;
    this.status_multi = this.navParams.data.status_multi;

    this.financial_status = this.navParams.data.financial_status;
    this.financial_status_multi = this.navParams.data.financial_status_multi;

    this.showDate = this.navParams.data.showDate;
    this.from_date = this.navParams.data.from_date;
    this.to_date = this.navParams.data.to_date;

    this.showDriver = this.navParams.data.showDriver;
    this.drivers = this.navParams.data.drivers;
    this.driver_id = this.navParams.data.driver_id;

    this.showCustomer = this.navParams.data.showCustomer;
    this.customers = this.navParams.data.customers;
    this.customer_id = this.navParams.data.customer_id;
    
    this.showPost = this.navParams.data.showPost;
    this.post = this.navParams.data.post;

    this.showEndCustomer = this.navParams.data.showEndCustomer;
    this.end_customer_name = this.navParams.data.end_customer_name;

  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      order_id: [null, []],
      city_id: [null, []],
      status: [null, []],
      status_multi: [[], []],
      financial_status: [null, []],
      financial_status_multi: [[], []],
      from_date: [null, []],
      to_date: [null, []],
      driver_id: [null, []],
      customer_id: [null, []],
      post: [null, []],
      end_customer_name: [null, []]
    });
    this.formGroup.patchValue({ order_id: this.order_id });
    this.formGroup.patchValue({ city_id: this.city_id });
    this.formGroup.patchValue({ financial_status: this.financial_status });
    this.formGroup.patchValue({ financial_status_multi: this.financial_status_multi });
    this.formGroup.patchValue({ status: this.status });
    this.formGroup.patchValue({ status_multi: this.status_multi });
    this.formGroup.patchValue({ from_date: this.from_date });
    this.formGroup.patchValue({ to_date: this.to_date });
    this.formGroup.patchValue({ driver_id: this.driver_id });
    this.formGroup.patchValue({ customer_id: this.customer_id });
    this.formGroup.patchValue({ post: this.post });
    this.formGroup.patchValue({ end_customer_name: this.end_customer_name });
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    this.modalController.dismiss(this.formGroup.value);
  }

  changeFinancialStatus(event) {
    if (event.detail.value.length) {
      this.formGroup.patchValue({ financial_status_multi: event.detail.value });
    } else {
      this.formGroup.patchValue({ financial_status_multi: null });
    }
  }

  changeStatus(event) {
    if (event.detail.value.length) {
      this.formGroup.patchValue({ status_multi: event.detail.value });
    } else {
      this.formGroup.patchValue({ status_multi: null });
    }
  }
}
