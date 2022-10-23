import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeStatusModalPageRoutingModule } from './change-status-modal-routing.module';

import { ChangeStatusModalPage } from './change-status-modal.page';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeStatusModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangeStatusModalPage],
  providers: [TranslatePipe]
})
export class ChangeStatusModalPageModule {}
