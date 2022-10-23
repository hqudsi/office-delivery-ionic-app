import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  
  constructor(private authService: AuthenticationService, private router: Router) {}
  
  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't comlete!
      map(isAuthenticated =>{
        if (isAuthenticated) {
          // Direct open inside area
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        } else {
          // Simple allow access to the login
          return true;
        }
      })
    );
  }
}
