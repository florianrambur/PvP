/* 
Imports and config
*/
  // Use environement value
  import { environment } from "../../../environments/environment";

  // The "Injectable" interface is needed to define a service
  import { Injectable } from '@angular/core';

  // The "HttpClient" and "HttpHeaders" interface is needed to make HTTP request
  import { HttpClient, HttpHeaders } from "@angular/common/http";

  // Import the model to type your function/parameters
  import { ChatModel } from 'src/app/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class SendMessageChatService {

  // Declare your api URL
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(
    // Inject "HttpClient" in the class to use it
    private HttpClient: HttpClient
  ) { }

  /* 
  Function to register a user
  - Param need to be type "UserModel"
  - Function return a Promise
  */
  public newMessage = ( content: String ): Promise<any> => {
    // Optional: set header request
    let myHeader = new HttpHeaders();
    myHeader.append('Content-Type', 'application/json');
    
    /* 
    Return a HTTP post request
    - Param one: API endpoint
    - Param two: data to send
    - Param tree (optional): request header
    */
    return this.HttpClient.post( `${this.apiUrl}/`, { content }, { headers: myHeader } )
    .toPromise() // Use Promise in an Angular Service
    .then( apiResponse => Promise.resolve(apiResponse) ) // Resolve Promise success
    .catch( apiResponse => Promise.reject(apiResponse) ) // Reject Promise error
  }
}
