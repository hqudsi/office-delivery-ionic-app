import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingOrdersModalPageRoutingModule } from './loading-orders-modal-routing.module';

import { LoadingOrdersModalPage } from './loading-orders-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingOrdersModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [LoadingOrdersModalPage]
})
export class LoadingOrdersModalPageModule {}
