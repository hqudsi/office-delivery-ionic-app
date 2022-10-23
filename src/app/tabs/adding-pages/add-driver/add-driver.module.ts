import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDriverPageRoutingModule } from './add-driver-routing.module';

import { AddDriverPage } from './add-driver.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDriverPageRoutingModule
  ],
  declarations: [AddDriverPage]
})
export class AddDriverPageModule {}
