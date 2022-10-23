import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriversCollectionPageRoutingModule } from './drivers-collection-routing.module';

import { DriversCollectionPage } from './drivers-collection.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriversCollectionPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule,
    PipesModule
  ],
  declarations: [DriversCollectionPage]
})
export class DriversCollectionPageModule {}
