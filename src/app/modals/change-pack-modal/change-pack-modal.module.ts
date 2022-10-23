import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePackModalPageRoutingModule } from './change-pack-modal-routing.module';

import { ChangePackModalPage } from './change-pack-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePackModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePackModalPage]
})
export class ChangePackModalPageModule {}
