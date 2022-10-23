import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMyCustomerModalPage } from './add-my-customer-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddMyCustomerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMyCustomerModalPageRoutingModule {}
