import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOrderModalPage } from './edit-order-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditOrderModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditOrderModalPageRoutingModule {}
