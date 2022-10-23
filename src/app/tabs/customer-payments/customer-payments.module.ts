import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPaymentsPageRoutingModule } from './customer-payments-routing.module';

import { CustomerPaymentsPage } from './customer-payments.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPaymentsPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule,
    PipesModule
  ],
  declarations: [CustomerPaymentsPage]
})
export class CustomerPaymentsPageModule {}
