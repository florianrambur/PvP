import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {

  private apiUrl = `${environment.apiUrl}/championship`;
  private token: String;

  constructor(
    private HttpClient: HttpClient,
    private Storage: Storage
  ) { }

  public newChampionship = (
    game: String,
    name: String,
    description: String,
    mode: String,
    rules: String,
    platforms: String,
    online: Boolean,
    isPrivate: Boolean,
    nbPlayers: Boolean,
    startDate: Date,
    place: String): Promise<any> => {

    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })

      return this.HttpClient.post( this.apiUrl, { game, name, description, mode, rules, platforms, online, isPrivate, nbPlayers, startDate, place }, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
    });
  }

  public getAllChampionships = (): Promise<any> => {
    return this.HttpClient.get( this.apiUrl )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) )
  }

  public getOneChampionship = (id: String): Promise<any> => {
    return this.HttpClient.get( this.apiUrl + '/' + id )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  public registerToTheChampionship = (itemId: String): Promise<any> => {
    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
        

      return this.HttpClient.put( this.apiUrl + '/subscribe/' + itemId, null, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
    });
  } 

  public unsubscribeToTheChampionship = (itemId: String): Promise<any> => {
    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
        

      return this.HttpClient.put( this.apiUrl + '/unsubscribe/' + itemId, null, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
    });
  } 

  public updateScore = (championshipId: String, idMatch: String, playerA: String, scorePlayerA: Number, playerB: String, scorePlayerB: Number): Promise<any> => {
    return this.HttpClient.put( this.apiUrl + '/updateScore/' + championshipId, { idMatch, playerA, scorePlayerA, playerB, scorePlayerB } )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  public closeChampionship = (championshipId: String): Promise<any> => {
    return this.HttpClient.put( this.apiUrl + '/close/' + championshipId, null)
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

}
