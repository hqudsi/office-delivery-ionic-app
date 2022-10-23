import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountStatementPage } from './account-statement.page';

const routes: Routes = [
  {
    path: '',
    component: AccountStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountStatementPageRoutingModule {}
