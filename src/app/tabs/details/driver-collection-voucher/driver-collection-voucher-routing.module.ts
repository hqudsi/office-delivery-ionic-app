import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverCollectionVoucherPage } from './driver-collection-voucher.page';

const routes: Routes = [
  {
    path: '',
    component: DriverCollectionVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverCollectionVoucherPageRoutingModule {}
