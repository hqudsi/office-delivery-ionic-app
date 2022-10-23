import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeTransCostModalPage } from './change-trans-cost-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeTransCostModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeTransCostModalPageRoutingModule {}
