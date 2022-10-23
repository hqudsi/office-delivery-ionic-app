import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPaymentPageRoutingModule } from './add-payment-routing.module';

import { AddPaymentPage } from './add-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPaymentPageRoutingModule
  ],
  declarations: [AddPaymentPage]
})
export class AddPaymentPageModule {}
