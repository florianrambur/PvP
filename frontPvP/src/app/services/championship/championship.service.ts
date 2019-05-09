import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChampionshipService {

  private apiUrl = `${environment.apiUrl}/championship`;

  constructor(
    private HttpClient: HttpClient
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
    nbPlayer: Boolean,
    startDate: Date,
    place: String): Promise<any> => {

      return this.HttpClient.post( this.apiUrl, { game, name, description, mode, rules, platforms, online, isPrivate, nbPlayer, startDate, place } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
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

  registerOrUnsubscribeToTheChampionship = (itemId: String): Promise<any> => {
    let myHeader = new HttpHeaders();
    myHeader.append('Content-Type', 'application/json');

    return this.HttpClient.put( this.apiUrl + '/subscribe/' + itemId, { headers: myHeader } )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  } 

}
