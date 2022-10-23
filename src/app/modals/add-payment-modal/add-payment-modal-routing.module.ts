import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPaymentModalPage } from './add-payment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddPaymentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPaymentModalPageRoutingModule {}
