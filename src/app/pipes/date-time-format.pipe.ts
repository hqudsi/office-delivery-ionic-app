import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(date: any, format: string): any {
    if (date) {
      return moment(date).format(format);
    }
  }

}
