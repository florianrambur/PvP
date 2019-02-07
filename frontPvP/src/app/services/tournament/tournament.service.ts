import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private apiUrl = `${environment.apiUrl}/tournament`;

  constructor(
    private HttpClient: HttpClient
  ) { }

  public newTournament = (game: String,
    name: String,
    description: String,
    mode: {
      name: String,
      description: String
    },
    rule: {
      name: String,
      description: String
    },
    online: Boolean,
    nbPlayers: Number,
    startDate: Date,
    place: String): Promise<any> => {
      let myHeader = new HttpHeaders();
      myHeader.append('Content-Type', 'application/json');

      return this.HttpClient.post( this.apiUrl, { game, name, description, mode, rule, online, nbPlayers, startDate, place}, { headers: myHeader } )
      .toPromise()
      .then( apiResponse => Promise.resolve(apiResponse) )
      .catch( apiResponse => Promise.reject(apiResponse) );
    }
}
