import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from './authentication.service';
 
const STORAGE_REQ_KEY = 'storedreq';
 
interface StoredRequest {
  url: string,
  type: string,
  data: any,
  params: any,
  time: number,
  id: string
}
 
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
 
  constructor(private storage: Storage, 
    private http: HttpClient, 
    private toastController: ToastController,
    private authService: AuthenticationService) { }
 
  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        // let storedObj = JSON.parse(storedOperations);
        let storedObj = (storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              let toast = this.toastController.create({
                message: `Local data succesfully synced to API!`,
                duration: 3000,
                position: 'bottom'
              });
              toast.then(toast => toast.present());
 
              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          console.log('no local events to sync');
          return of(false);
        }
      })
    )
  }
 
  storeRequest(url, type, data, params) {
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 9000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
 
    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      params: params,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
    
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      // let storedObj = JSON.parse(storedOperations);
      let storedObj = (storedOperations);
 
      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      // return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
      return this.storage.set(STORAGE_REQ_KEY, (storedObj));
    });
  }
 
  sendRequests(operations: StoredRequest[]) {
    let obs = [];
 
    for (let op of operations) {
      let params: HttpParams = op.params;
      let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token
      });

      let oneObs = this.http.request(op.type,op.url,{ body: op.data, params: params, headers: headers}) //(op.type, op.url, op.data, op.options);
      obs.push(oneObs);
    }
 
    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }
}