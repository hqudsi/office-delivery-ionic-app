import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverCollectionVoucherModalPage } from './driver-collection-voucher-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DriverCollectionVoucherModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverCollectionVoucherModalPageRoutingModule {}
