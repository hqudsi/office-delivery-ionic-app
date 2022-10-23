import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

export const INTRO_KEY = 'intro_seen';
import { Plugins } from '@capacitor/core'
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) { }
  
  async canLoad(): Promise<boolean>  {
    const { value } = await Storage.get({key: INTRO_KEY});
    if (value  && (value === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl: true }); //replaceUrl: true ----> to avaid get back to intro.
      return true;
    }
  }

}
