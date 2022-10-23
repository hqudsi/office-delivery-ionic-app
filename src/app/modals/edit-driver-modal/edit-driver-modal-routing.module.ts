import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDriverModalPage } from './edit-driver-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditDriverModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDriverModalPageRoutingModule {}
