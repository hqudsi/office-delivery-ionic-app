import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverOrdersReportPage } from './driver-orders-report.page';

const routes: Routes = [
  {
    path: '',
    component: DriverOrdersReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverOrdersReportPageRoutingModule {}
