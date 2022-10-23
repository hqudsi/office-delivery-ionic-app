import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinanceChangesPageRoutingModule } from './finance-changes-routing.module';

import { FinanceChangesPage } from './finance-changes.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives/shared-directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinanceChangesPageRoutingModule,
    TranslateModule,
    SharedDirectivesModule,
    PipesModule
  ],
  declarations: [FinanceChangesPage]
})
export class FinanceChangesPageModule {}
