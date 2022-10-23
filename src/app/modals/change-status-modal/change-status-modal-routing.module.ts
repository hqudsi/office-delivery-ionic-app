import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeStatusModalPage } from './change-status-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeStatusModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeStatusModalPageRoutingModule {}
