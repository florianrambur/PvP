import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GameModel } from '../../models/game.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = `${environment.apiUrl}/game`;
  private token: String;

  constructor(
    private HttpClient: HttpClient,
    private Storage: Storage
  ) { }

  public newGame = (name: String,
    platforms: [String],
    modes: [{
        name: String,
        description: String
    }],
    rules: [{
        name: String,
        description: String
    }],
    image: String): Promise<any> => {
    
    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })

      return this.HttpClient.post( this.apiUrl, { name, platforms, modes, rules, image }, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
    });
  }

  getAllGames = (): Promise<any> => {
    return this.HttpClient.get( this.apiUrl )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  getOneGame = (id: String): Promise<any> => {
    return this.HttpClient.get( this.apiUrl + '/' + id )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }

  updateGame = (id: String, name: String,
    platforms: [String],
    modes: [{
        name: String,
        description: String
    }],
    rules: [{
        name: String,
        description: String
    }],
    image: String): Promise<any> => {
    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })

      return this.HttpClient.put( this.apiUrl + '/' + id, { name, platforms, modes, rules, image }, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );

    });    
  }

  deleteGame = (id: String): Promise<any> => {
    let store = this.Storage.get('access_token');

    return store.then(data => {
      this.token = data;
      let myHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })

      return this.HttpClient.delete( this.apiUrl + '/' + id, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );

    });
  }
  
}
