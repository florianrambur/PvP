import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private apiUrl = `${environment.apiUrl}/tournament`;
  private token: String;

  constructor(
    private HttpClient: HttpClient,
    private Storage: Storage
  ) { }

  public newTournament = (game: String,
    name: String,
    description: String,
    mode: {
      name: String,
      description: String
    },
    rules: {
      name: String,
      description: String
    },
    platforms: {
      name: String
    },
    online: Boolean,
    isPrivate: Boolean,
    nbPlayers: Number,
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

  getAllTournaments = (): Promise<any> => {
    return this.HttpClient.get( this.apiUrl )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  getOneTournament = (id: String): Promise<any> => {
    return this.HttpClient.get( this.apiUrl + '/' + id )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  registerOrUnsubscribeToTheTournament = (itemId: String): Promise<any> => {
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
}
