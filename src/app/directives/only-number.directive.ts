import { Directive, ElementRef, HostListener } from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {
  
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onInput(event: any) {
    const pattern = /[0-9]/; // without ., for integer only
    let inputChar = String.fromCharCode(event.which ? event.which : event.keyCode);
    let current: string = this.el.nativeElement.value;
    if (current.length >= this.el.nativeElement.maxlength) {
      event.preventDefault();
      return false;
    }
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    return true;
  }
}
