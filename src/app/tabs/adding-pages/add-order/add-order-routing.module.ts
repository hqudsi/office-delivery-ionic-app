import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrderPage } from './add-order.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrderPageRoutingModule {}
