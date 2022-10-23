import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap, switchMap, catchError} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'my_token';
const USER_DATA_KEY = 'user_data';
const USER_DETAILS_KEY = 'user_details';
const API_URL = environment.apiLink;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  user: any;
  userDetails: any;

  public myToken = new BehaviorSubject('');

  constructor(private http:HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    const userString = await Storage.get({ key: USER_DATA_KEY });
    const userDetailsString = await Storage.get({ key: USER_DETAILS_KEY });
    const user = JSON.parse(userString.value);
    const userDetails = JSON.parse(userDetailsString.value);
    if (token && token.value) {
      this.token = token.value;
      this.myToken.next(this.token);
      this.user = user;
      this.userDetails = userDetails;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  setUserDetails(userData) {
    Storage.set({key: USER_DETAILS_KEY, value: JSON.stringify(userData)});
    this.userDetails = userData;
  }

  login(credentials: {email, password}): Observable<any> {
    return this.http.post(`${API_URL}/login`, credentials).pipe(
      map((result: any) => { 
        if (result.success) {
          Storage.set({key: TOKEN_KEY, value: result.token});
          Storage.set({key: USER_DATA_KEY, value: JSON.stringify(result.user)});
          Storage.set({key: USER_DETAILS_KEY, value: JSON.stringify(result.userDetails)});
          this.token = result.token;
          this.myToken.next(this.token);
          this.user = result.user;
          this.userDetails = result.userDetails;
          this.isAuthenticated.next(true);
        }
        return result;
      }),
      catchError(err => {
        throw new Error(err);
        // return 'result';
      })
    );
  }

  updateUserData(data) {
    Storage.set({key: USER_DATA_KEY, value: JSON.stringify(data.user)});
    Storage.set({key: USER_DETAILS_KEY, value: JSON.stringify(data.userDetails)});
    this.user = data.user;
    this.userDetails = data.userDetails;
  }

  register(dataRequest): Observable<any> {
    return this.http.post(`${API_URL}/logisticsRegister`, dataRequest).pipe(
      map(res => res),
      catchError(err => {
        throw new Error(err);
        // return 'result';
      })
    );
  }

  logout(): Promise<void> {
    this.myToken.next('');
    this.isAuthenticated.next(false);
    Storage.remove({ key: USER_DATA_KEY });
    Storage.remove({ key: USER_DETAILS_KEY });
    return Storage.remove({ key: TOKEN_KEY });
  }

  companyId() {
    if (this.user.type == 1 || this.user.type == 2) {
      return this.userDetails.id;
    } else {
      return this.user.company_id;
    }
  }

  userTypeText() {
    if (this.user.type == 1) {
      return 'company_id';
    } else if (this.user.type == 2) {
      return 'customer_id';
    } else {
      return 'driver_id';
    }
  }

}
