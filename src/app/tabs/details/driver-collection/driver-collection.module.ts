import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverCollectionPageRoutingModule } from './driver-collection-routing.module';

import { DriverCollectionPage } from './driver-collection.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverCollectionPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule
  ],
  declarations: [DriverCollectionPage]
})
export class DriverCollectionPageModule {}
