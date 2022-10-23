import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerOrdersReportPage } from './customer-orders-report.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerOrdersReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerOrdersReportPageRoutingModule {}
