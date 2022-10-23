import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverCollectionVoucherPageRoutingModule } from './driver-collection-voucher-routing.module';

import { DriverCollectionVoucherPage } from './driver-collection-voucher.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverCollectionVoucherPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule,
    PipesModule
  ],
  declarations: [DriverCollectionVoucherPage]
})
export class DriverCollectionVoucherPageModule {}
