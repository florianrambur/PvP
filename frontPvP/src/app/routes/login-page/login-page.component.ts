/* 
Imports and config
*/

  // Import the "OnInit" interface to enable Angular "ngOnInit" hook (cf. code below)
  import { Component, OnInit } from '@angular/core';

  // Import interface to use Angular form technic
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";
  import {Router} from "@angular/router";
  import { Location } from '@angular/common';
  import { Storage } from '@ionic/storage';

  // Import the service you need to use
  import { AuthService } from "../../services/auth/auth.service";
  import { UtilsService } from "../../services/utils/utils.service";
import { resolve } from 'path';

  // Config
  @Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    providers: [ AuthService ],
    styleUrls: ['./login-page.component.scss'],
  }) 
//
export class LoginPageComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private AuthService: AuthService,
    private FormBuilder: FormBuilder,
    private UtilsService: UtilsService,
    private Router: Router,
    private Storage: Storage,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  private resetForm = () => {
    this.form = this.FormBuilder.group({
      email: [ undefined, Validators.required ],
      password: [ undefined, Validators.required ]
    })
  }

  public login = () => {
    this.AuthService.login( this.form.value.email, this.form.value.password )
    .then( apiResponse => {
        console.log(apiResponse);
        if (apiResponse.data.countConnection == 0) {
          this.Router.navigate(['/tutorial']);
        } else {
          this.Router.navigate(['/']);
        }
        console.log(apiResponse.data.token);
        this.Storage.set('access_token', apiResponse.data.token);
        this.UtilsService.flashMessage('success', 'Vous vous êtes connecté avec succès !');
      })
    .catch( apiResponse => {
      console.error(apiResponse);
      this.UtilsService.flashMessage('error', 'L\'identifiant ou le mot de passe sont incorrects.');
    })
  }

  ngOnInit() {
    this.resetForm();
  }

}
