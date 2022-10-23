import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMyCustomerModalPageRoutingModule } from './add-my-customer-modal-routing.module';

import { AddMyCustomerModalPage } from './add-my-customer-modal.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMyCustomerModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [AddMyCustomerModalPage],
  providers: [TranslatePipe]
})
export class AddMyCustomerModalPageModule {}
