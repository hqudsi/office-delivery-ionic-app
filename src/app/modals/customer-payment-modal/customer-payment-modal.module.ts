import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPaymentModalPageRoutingModule } from './customer-payment-modal-routing.module';

import { CustomerPaymentModalPage } from './customer-payment-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPaymentModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [CustomerPaymentModalPage]
})
export class CustomerPaymentModalPageModule {}
