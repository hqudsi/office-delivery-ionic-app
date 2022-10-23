import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadingOrdersModalPage } from './loading-orders-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingOrdersModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingOrdersModalPageRoutingModule {}
