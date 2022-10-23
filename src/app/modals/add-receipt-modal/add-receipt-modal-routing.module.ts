import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddReceiptModalPage } from './add-receipt-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddReceiptModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddReceiptModalPageRoutingModule {}
