import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDriverPage } from './add-driver.page';

const routes: Routes = [
  {
    path: '',
    component: AddDriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDriverPageRoutingModule {}
