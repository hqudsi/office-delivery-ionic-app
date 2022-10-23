import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOrderModalPageRoutingModule } from './edit-order-modal-routing.module';

import { EditOrderModalPage } from './edit-order-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditOrderModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [EditOrderModalPage]
})
export class EditOrderModalPageModule {}
