import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeWhoPayModalPage } from './change-who-pay-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeWhoPayModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeWhoPayModalPageRoutingModule {}
