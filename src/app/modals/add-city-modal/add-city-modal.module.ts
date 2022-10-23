import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCityModalPageRoutingModule } from './add-city-modal-routing.module';

import { AddCityModalPage } from './add-city-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCityModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [AddCityModalPage]
})
export class AddCityModalPageModule {}
