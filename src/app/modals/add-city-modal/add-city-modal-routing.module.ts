import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCityModalPage } from './add-city-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddCityModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCityModalPageRoutingModule {}
