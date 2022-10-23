import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Plugins } from '@capacitor/core'
import { Key } from 'protractor';
const { Storage } = Plugins;

const LANG_KEY = 'selected_language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  dir = '';

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  async setInitialAppLanguage() {
    let language = 'ar';//this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    this.selected = language;
    this.setDirection(language);
    const { value } = await Storage.get({key: LANG_KEY});
    if (value) {
      this.setLanguage(value);
      this.selected = value;
    }
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en', img: 'assets/imgs/en.png' },
      { text: 'عربي', value: 'ar', img: 'assets/imgs/ar.png' }
    ];
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this.setDirection(lng);
    this.selected = lng;
    // localStorage.setItem(LANG_KEY, lng);
    Storage.set({key: LANG_KEY, value: lng})
  }

  setDirection(lng) {
    if (lng == 'ar'){
      this.document.documentElement.dir = 'rtl';
      this.dir = 'rtl';
    } else {
      this.document.documentElement.dir = 'ltr';
      this.dir = 'ltr';
    }
  }

  getCurrentDirection() {
    return this.dir;
  }

}
