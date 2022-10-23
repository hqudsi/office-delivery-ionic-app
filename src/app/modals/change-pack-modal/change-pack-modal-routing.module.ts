import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePackModalPage } from './change-pack-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePackModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePackModalPageRoutingModule {}
