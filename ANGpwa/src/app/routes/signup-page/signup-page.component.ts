/* 
Imports and config
*/

  // Import the "OnInit" interface to enable Angular "ngOnInit" hook (cf. code below)
  import { Component, OnInit } from '@angular/core';

  // Import interface to use Angular form technic
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";
  import { Router } from '@angular/router';

  // Import the service you need to use
  import { AuthService } from "../../services/auth/auth.service";

  // Config
  @Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    providers: [ AuthService ] // All used service must be declared in the "providers" array
  })
//


/* 
Export
*/
  // To use "ngOnInit" hook you need to implelment it in the class
  export class SignupPageComponent implements OnInit {

    // Create a FormGroup form
    public form: FormGroup;

    // Injectr value in the class
    constructor(
      private FormBuilder: FormBuilder, // Inject "FormBuilder" in the class
      private AuthService: AuthService, // Inject the service you need to use in the class
      private Router: Router
    ) { }

    // Create a function to set from
    private initForm = () => {
      // Use "FormBuilder" to define your needed form values
      this.form = this.FormBuilder.group({
        first_name: [ undefined, Validators.required ],
        last_name: [ undefined, Validators.required ],
        email: [ undefined, Validators.required ],
        password: [ undefined, Validators.required ]
      })
    }

    // Create a function to register user
    public signup = () => {
      /* 
      Send data to the service
      - Data must be "UserModel" typed (cf. AuthService code)
      */
      this.AuthService.signup( this.form.value )
      .then( apiResponse => {
        console.log(apiResponse);
        this.Router.navigate(['/login']);
      })
      .catch( apiResponse => console.error(apiResponse) )
    }

    // Hoook ngOnInit: eq. DOMContentLoaded for a component
    ngOnInit() {
      this.initForm()
    }

  }
//