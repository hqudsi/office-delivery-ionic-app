import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverCollectionPage } from './driver-collection.page';

const routes: Routes = [
  {
    path: '',
    component: DriverCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverCollectionPageRoutingModule {}
