import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDriverModalPageRoutingModule } from './edit-driver-modal-routing.module';

import { EditDriverModalPage } from './edit-driver-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDriverModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [EditDriverModalPage]
})
export class EditDriverModalPageModule {}
