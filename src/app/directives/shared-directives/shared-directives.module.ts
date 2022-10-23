import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from '../only-number.directive';
import { TwoDigitNumberDirective } from '../two-digit-number.directive';
import { HideHeaderDirective } from '../hide-header.directive';
import { StickySegmentDirective } from '../sticky-segment.directive';



@NgModule({
  declarations: [OnlyNumberDirective, TwoDigitNumberDirective, HideHeaderDirective, StickySegmentDirective],
  exports: [OnlyNumberDirective, TwoDigitNumberDirective, HideHeaderDirective, StickySegmentDirective],
  imports: [
    CommonModule
  ]
})
export class SharedDirectivesModule { }
