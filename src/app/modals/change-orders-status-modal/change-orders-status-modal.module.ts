import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeOrdersStatusModalPageRoutingModule } from './change-orders-status-modal-routing.module';

import { ChangeOrdersStatusModalPage } from './change-orders-status-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeOrdersStatusModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeOrdersStatusModalPage]
})
export class ChangeOrdersStatusModalPageModule {}
