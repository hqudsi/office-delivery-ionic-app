import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.component.html',
  styleUrls: ['./language-popover.component.scss'],
})
export class LanguagePopoverComponent implements OnInit {

  currenctLanguage: String = '';
  constructor(private languageService: LanguageService) { }

  ngOnInit() {
    this.currenctLanguage = this.languageService.selected;
  }

  radioGroupChange(event) {
    this.currenctLanguage = event.detail.value;
    this.languageService.setLanguage(event.detail.value);
    // Reload because our routing is out of place
    window.location.reload();
  }


}
