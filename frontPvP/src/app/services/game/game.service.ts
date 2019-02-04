import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GameModel } from '../../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = `${environment.apiUrl}/game`;

  constructor(
    private HttpClient: HttpClient
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
    }]): Promise<any> => {
    let myHeader = new HttpHeaders();
    myHeader.append('Content-Type', 'application/json');

    return this.HttpClient.post( this.apiUrl, { name, platforms, modes, rules }, { headers: myHeader } )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
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

  deleteGame = (id: String): Promise<any> => {
    return this.HttpClient.delete( this.apiUrl + '/' + id )
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }
  
}
