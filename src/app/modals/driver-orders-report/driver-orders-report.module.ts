import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverOrdersReportPageRoutingModule } from './driver-orders-report-routing.module';

import { DriverOrdersReportPage } from './driver-orders-report.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverOrdersReportPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [DriverOrdersReportPage]
})
export class DriverOrdersReportPageModule {}
