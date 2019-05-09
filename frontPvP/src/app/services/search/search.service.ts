import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = `${environment.apiUrl}/search`;

  constructor(
    private HttpClient: HttpClient
  ) { }

  public searchCompetition = (searchFields: Object): Promise<any> => {
    return this.HttpClient.post( this.apiUrl + '/competition',  searchFields)
    .toPromise()
    .then( apiResponse => Promise.resolve(apiResponse) )
    .catch( apiResponse => Promise.reject(apiResponse) );
  }
}
