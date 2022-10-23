import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReceiptModalPageRoutingModule } from './add-receipt-modal-routing.module';

import { AddReceiptModalPage } from './add-receipt-modal.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReceiptModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedDirectivesModule
  ],
  declarations: [AddReceiptModalPage],
  providers: [TranslatePipe]
})
export class AddReceiptModalPageModule {}
