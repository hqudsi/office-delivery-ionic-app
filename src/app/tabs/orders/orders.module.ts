import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule,
    PipesModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
