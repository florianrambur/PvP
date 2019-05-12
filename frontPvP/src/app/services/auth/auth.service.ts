/* 
Imports and config
*/
  import { environment } from "../../../environments/environment";
  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from "@angular/common/http";
  import { UserModel } from "../../models/user.model";
  import { UtilsService } from '../utils/utils.service';
  import { Storage } from '@ionic/storage';
  

  // Config
  @Injectable({
    providedIn: 'root'
  })
//


/* 
Export
*/
  export class AuthService {

    // Declare your api URL
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(
      private HttpClient: HttpClient,
      private UtilsService: UtilsService,
      private Storage: Storage
    ) { }

    public isLoggedIn() {
      let tokenValue = this.Storage.get('access_token');
      
      return tokenValue
      .then(token => {
          if (token == null || token == '') {
              return false;
          } else {
              return true;
          }
        }
      )
    }

    public signOut = () => {
      return this.Storage.remove('access_token')
      .then( response => { this.UtilsService.setIsLogged(false); this.UtilsService.setCurrentUserId(null); } )
      .catch( response => Promise.reject(response) )
    }

    public signup = ( data: UserModel ): Promise<any> => {
      // Optional: set header request
      let myHeader = new HttpHeaders();
      myHeader.append('Content-Type', 'application/json');
      
      return this.HttpClient.post( `${this.apiUrl}/register`, data, { headers: myHeader } )
      .toPromise() // Use Promise in an Angular Service
      .then( apiResponse => Promise.resolve(apiResponse) ) // Resolve Promise success
      .catch( apiResponse => Promise.reject(apiResponse) ) // Reject Promise error
    } 

    public login = ( email: String, password: String ): Promise<any> => {
      
      return this.HttpClient.post( `${this.apiUrl}/login`, { email, password } )
      .toPromise() // Use Promise in an Angular Service
      .then( apiResponse => Promise.resolve(apiResponse) ) // Resolve Promise success
      .catch( apiResponse => Promise.reject(apiResponse) ) // Reject Promise error
    }

    public getUserById = ( id: String ): Promise<any> => {
      return this.HttpClient.get( `${this.apiUrl}/` + id )
      .toPromise() // Use Promise in an Angular Service
      .then( apiResponse => Promise.resolve(apiResponse) ) // Resolve Promise success
      .catch( apiResponse => Promise.reject(apiResponse) ) // Reject Promise error
    }

    public getCurrentUser = () => {
      return this.HttpClient.get( `${this.apiUrl}/me`)
      .toPromise() // Use Promise in an Angular Service
      .then( apiResponse => Promise.resolve(apiResponse) ) // Resolve Promise success
      .catch( apiResponse => Promise.reject(apiResponse) ) // Reject Promise error
    }
  }
//