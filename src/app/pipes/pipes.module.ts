import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateTimeFormatPipe } from './date-time-format.pipe';

@NgModule({
declarations: [DateTimeFormatPipe],
imports: [CommonModule],
exports: [DateTimeFormatPipe],
})

export class PipesModule {}