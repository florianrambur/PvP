/* 
Imports and config
*/

  // Import the "OnInit" interface to enable Angular "ngOnInit" hook (cf. code below)
  import { Component, OnInit } from '@angular/core';
  // Import interface to use Angular form technic
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";
  import { Router } from '@angular/router';
  // Import the service you need to use
  import { UtilsService } from "../../services/utils/utils.service";
  import { AuthService } from "../../services/auth/auth.service";
  import { Location } from '@angular/common';



  // Config
  @Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    providers: [ UtilsService, AuthService ], // All used service must be declared in the "providers" array,
    styleUrls: ['./signup-page.component.scss']
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
      private UtilsService: UtilsService,
      private AuthService: AuthService, // Inject the service you need to use in the class
      private Router: Router,
      private _location: Location
    ) { }

    backClicked() {
      this._location.back();
    }

    // Create a function to set from
    private initForm = () => {
      // Use "FormBuilder" to define your needed form values
      this.form = this.FormBuilder.group({
        pseudo: [ undefined, Validators.required ],
        email: [ undefined, [Validators.required] ],
        password: [ undefined, Validators.required ],
        parameters: this.FormBuilder.group({
          twitch: [ ""  ],
          discord: [ "" ]
        })
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
        this.UtilsService.flashMessage('success', 'Votre compte a été créé avec succès!');
      })
      .catch( apiResponse => {
        console.error(apiResponse);
        this.UtilsService.flashMessage('error', 'Une erreur s\'est produite durant l\'inscription');
      } )
    }

    // Hoook ngOnInit: eq. DOMContentLoaded for a component
    ngOnInit() {
      this.initForm()
    }

  }
//