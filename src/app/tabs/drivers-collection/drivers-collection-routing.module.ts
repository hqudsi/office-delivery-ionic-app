import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriversCollectionPage } from './drivers-collection.page';

const routes: Routes = [
  {
    path: '',
    component: DriversCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversCollectionPageRoutingModule {}
