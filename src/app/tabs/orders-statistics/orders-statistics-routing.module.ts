import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersStatisticsPage } from './orders-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersStatisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersStatisticsPageRoutingModule {}
