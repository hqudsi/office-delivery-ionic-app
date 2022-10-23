import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordModalPageRoutingModule } from './reset-password-modal-routing.module';

import { ResetPasswordModalPage } from './reset-password-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [ResetPasswordModalPage]
})
export class ResetPasswordModalPageModule {}
