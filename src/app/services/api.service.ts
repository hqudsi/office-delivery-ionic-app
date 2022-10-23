import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslatePipe } from '@ngx-translate/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { ConnectionStatus, NetworkService } from './network.service';
import { OfflineManagerService } from './offline-manager.service';

const API_STORAGE_KEY = 'logistics-key';
const API_URL = environment.apiLink;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers: any;
  options: any;

  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private translatePipe: TranslatePipe
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authService.token
    });
    this.options = { headers: this.headers };
    this.authService.myToken.subscribe((data) => {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data
      });
      this.options = { headers: this.headers };
  });
  }

  getApi(forceRefresh: boolean = false, objectKey: string, subUrl: string, params: any = null): Observable<any[]> {
    // if(params) {
		// 	this.options['params'] = params;
		// }
    this.options['params'] = params;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData(objectKey));
    } else {
      // Just to get some "random" data
      // let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      return this.http.get(API_URL + subUrl, this.options).pipe(
        map(res => res['data']),
        tap(res => {
          this.setLocalData(objectKey, res);
        })
      );
    }
  }

  postApi(subUrl: string, data: any = null, params: any = null): Observable<any> {
    // if(params) {
		// 	this.options['params'] = params;
		// }
    this.options['params'] = params;
    let url = API_URL + subUrl; //`${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      // return from(this.offlineManager.storeRequest(url, 'POST', data, params));
      let toast = this.toastController.create({
        message: ` <ion-icon name="cloud-offline-outline"></ion-icon> ` + this.translatePipe.transform('TOAST.check_net') + `!`,
        duration: 9000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
      return of(false);
    } else {
      return this.http.post(url, data, this.options).pipe(
        map(res => res),
        catchError(err => {
          // this.offlineManager.storeRequest(url, 'POST', data, params);
          console.log('error: ', err);
          throw new Error(err);
        })
      );
    }
  }

  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  public clearStorage() {
    this.storage.clear();
  }
  
}
