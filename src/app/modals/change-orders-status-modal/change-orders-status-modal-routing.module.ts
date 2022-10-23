import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeOrdersStatusModalPage } from './change-orders-status-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeOrdersStatusModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOrdersStatusModalPageRoutingModule {}
