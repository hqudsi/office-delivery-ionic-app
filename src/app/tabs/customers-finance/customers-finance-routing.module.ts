import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersFinancePage } from './customers-finance.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersFinancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersFinancePageRoutingModule {}
