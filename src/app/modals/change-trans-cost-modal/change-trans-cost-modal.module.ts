import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeTransCostModalPageRoutingModule } from './change-trans-cost-modal-routing.module';

import { ChangeTransCostModalPage } from './change-trans-cost-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeTransCostModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeTransCostModalPage]
})
export class ChangeTransCostModalPageModule {}
