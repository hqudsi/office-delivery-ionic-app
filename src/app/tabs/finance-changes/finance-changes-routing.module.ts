import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinanceChangesPage } from './finance-changes.page';

const routes: Routes = [
  {
    path: '',
    component: FinanceChangesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceChangesPageRoutingModule {}
