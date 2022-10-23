import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFilterModalPageRoutingModule } from './edit-filter-modal-routing.module';

import { EditFilterModalPage } from './edit-filter-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFilterModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [EditFilterModalPage]
})
export class EditFilterModalPageModule {}
