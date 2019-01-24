/* 
Imports and config
*/

  // Import the "OnInit" interface to enable Angular "ngOnInit" hook (cf. code below)
  import { Component, OnInit } from '@angular/core';

  // Import interface to use Angular form technic
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";

  // Import the service you need to use
  import { SendMessageChatService } from "../../services/send-message-chat/send-message-chat.service";

  // Config
  @Component({
    selector: 'app-send-message-chat-page',
    templateUrl: './send-message-chat-page.component.html',
    providers: [ SendMessageChatService ] // All used service must be declared in the "providers" array
  })
//

/* 
Export
*/
  // To use "ngOnInit" hook you need to implelment it in the class
  export class SendMessageChatPageComponent implements OnInit {

    // Create a FormGroup form
    public form: FormGroup;

    // Injectr value in the class
    constructor(
      private FormBuilder: FormBuilder, // Inject "FormBuilder" in the class
      private SendMessageChatService: SendMessageChatService // Inject the service you need to use in the class
    ) { }

    // Create a function to set from
    private initForm = () => {
      // Use "FormBuilder" to define your needed form values
      this.form = this.FormBuilder.group({
        content: [ undefined, Validators.required ]
      })
    }

    // Create a function to create message
    public newMessage = () => {
      /* 
      Send data to the service
      - Data must be "ChatModel" typed (cf. ChatModel code)
      */
      this.SendMessageChatService.newMessage( this.form.value.content )
      .then( apiResponse => console.log(apiResponse) )
      .catch( apiResponse => console.error(apiResponse) )
    }

    // Hoook ngOnInit: eq. DOMContentLoaded for a component
    ngOnInit() {
      this.initForm()
    }

  }
//