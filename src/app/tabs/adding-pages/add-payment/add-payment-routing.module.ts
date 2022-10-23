import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPaymentPage } from './add-payment.page';

const routes: Routes = [
  {
    path: '',
    component: AddPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPaymentPageRoutingModule {}
