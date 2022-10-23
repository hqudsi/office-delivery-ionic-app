import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFilterModalPage } from './edit-filter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditFilterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFilterModalPageRoutingModule {}
