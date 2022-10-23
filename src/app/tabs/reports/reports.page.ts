import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CustomerOrdersReportPage } from 'src/app/modals/customer-orders-report/customer-orders-report.page';
import { DriverOrdersReportPage } from 'src/app/modals/driver-orders-report/driver-orders-report.page';

import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TemplateReportService } from 'src/app/services/template-report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  userType: any;

  payments: any;
  constructor(
    private authService: AuthenticationService,
    private modalController: ModalController
  ) {
    this.userType = this.authService.user.type;
  }

  ngOnInit() {
  }

  async driverOrdersReport() {
    const modal = await this.modalController.create({
      component: DriverOrdersReportPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
  }

  async customerOrdersReport() {
    const modal = await this.modalController.create({
      component: CustomerOrdersReportPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
  }

}
