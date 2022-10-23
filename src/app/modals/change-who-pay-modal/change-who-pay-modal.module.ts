import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeWhoPayModalPageRoutingModule } from './change-who-pay-modal-routing.module';

import { ChangeWhoPayModalPage } from './change-who-pay-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeWhoPayModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeWhoPayModalPage]
})
export class ChangeWhoPayModalPageModule {}
