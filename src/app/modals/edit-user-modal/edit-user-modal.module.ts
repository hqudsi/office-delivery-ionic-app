import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserModalPageRoutingModule } from './edit-user-modal-routing.module';

import { EditUserModalPage } from './edit-user-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [EditUserModalPage]
})
export class EditUserModalPageModule {}
