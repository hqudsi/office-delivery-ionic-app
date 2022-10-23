import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersStatisticsPageRoutingModule } from './orders-statistics-routing.module';

import { OrdersStatisticsPage } from './orders-statistics.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersStatisticsPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule
  ],
  declarations: [OrdersStatisticsPage]
})
export class OrdersStatisticsPageModule {}
