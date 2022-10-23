import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPaymentPage } from './customer-payment.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPaymentPageRoutingModule {}
