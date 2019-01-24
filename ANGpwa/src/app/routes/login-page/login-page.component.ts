/* 
Imports and config
*/

  // Import the "OnInit" interface to enable Angular "ngOnInit" hook (cf. code below)
  import { Component, OnInit } from '@angular/core';

  // Import interface to use Angular form technic
  import { FormBuilder, FormGroup, Validators } from "@angular/forms";
  import {Router} from "@angular/router";

  // Import the service you need to use
  import { AuthService } from "../../services/auth/auth.service";

  // Config
  @Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    providers: [ AuthService ]
  }) 
//
export class LoginPageComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private AuthService: AuthService,
    private FormBuilder: FormBuilder,
    private Router: Router
  ) { }

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
        this.Router.navigate(['/']);
      })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.resetForm()
  }

}
