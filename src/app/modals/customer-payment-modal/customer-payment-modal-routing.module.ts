import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPaymentModalPage } from './customer-payment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPaymentModalPageRoutingModule {}
