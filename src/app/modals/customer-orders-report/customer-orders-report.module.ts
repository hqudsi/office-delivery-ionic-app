import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerOrdersReportPageRoutingModule } from './customer-orders-report-routing.module';

import { CustomerOrdersReportPage } from './customer-orders-report.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerOrdersReportPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerOrdersReportPage]
})
export class CustomerOrdersReportPageModule {}
