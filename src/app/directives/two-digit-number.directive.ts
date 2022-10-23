import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDigitNumber]'
})
export class TwoDigitNumberDirective {
  // private regex: RegExp = new RegExp(/^\d*\.?\d{0,1}$/g);
  private regex: RegExp = new RegExp(/^\d{0,6}\.?\d{0,1}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onInput(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    if (current && (parseInt(current) > 99999) ) {
      event.preventDefault();
    }
    if (current && !String(current).match(this.regex)) {
      event.preventDefault();
    }
  }
}
