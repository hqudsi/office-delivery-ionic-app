import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPaymentModalPageRoutingModule } from './add-payment-modal-routing.module';

import { AddPaymentModalPage } from './add-payment-modal.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPaymentModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [AddPaymentModalPage],
  providers: [TranslatePipe]
})
export class AddPaymentModalPageModule {}
