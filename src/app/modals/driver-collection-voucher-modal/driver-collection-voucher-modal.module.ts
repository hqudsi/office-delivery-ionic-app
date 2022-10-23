import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverCollectionVoucherModalPageRoutingModule } from './driver-collection-voucher-modal-routing.module';

import { DriverCollectionVoucherModalPage } from './driver-collection-voucher-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverCollectionVoucherModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [DriverCollectionVoucherModalPage]
})
export class DriverCollectionVoucherModalPageModule {}
