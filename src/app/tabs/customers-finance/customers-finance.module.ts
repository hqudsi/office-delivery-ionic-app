import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersFinancePageRoutingModule } from './customers-finance-routing.module';

import { CustomersFinancePage } from './customers-finance.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersFinancePageRoutingModule,
    TranslateModule,
    SharedDirectivesModule
  ],
  declarations: [CustomersFinancePage]
})
export class CustomersFinancePageModule {}
