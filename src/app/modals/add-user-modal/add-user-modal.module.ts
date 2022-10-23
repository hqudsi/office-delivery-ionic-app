import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUserModalPageRoutingModule } from './add-user-modal-routing.module';

import { AddUserModalPage } from './add-user-modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUserModalPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedDirectivesModule
  ],
  declarations: [AddUserModalPage]
})
export class AddUserModalPageModule {}
