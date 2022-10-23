import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountStatementPageRoutingModule } from './account-statement-routing.module';

import { AccountStatementPage } from './account-statement.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountStatementPageRoutingModule,
    TranslateModule,
    PipesModule
  ],
  declarations: [AccountStatementPage]
})
export class AccountStatementPageModule {}
