import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from "@angular/router";

import { GameService } from '../../../services/game/game.service';

@Component({
  selector: 'app-create-game-page',
  templateUrl: './create-game-page.component.html',
  providers: [ GameService ]
})

export class CreateGamePageComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    private Router: Router
  ) { }

  private initForm = () => {
    this.form = this.FormBuilder.group({
      name: [ undefined, Validators.required ],
      platforms: this.FormBuilder.array([this.createPlatform()]),
      modes: this.FormBuilder.array([this.createMode()]),
      rules: this.FormBuilder.array([this.createRule()])
    });
  }

  createPlatform = () => {
    return this.FormBuilder.group({
      name: [ 'Nom de la plateforme', Validators.required ]
    })
  }

  createMode = () => {
    return this.FormBuilder.group({
      name: [ 'Nom du mode', Validators.required ],
      description: [ 'Description', Validators.required ]
    });
  }

  createRule = () => {
    return this.FormBuilder.group({
      name: [ 'Nom de la règle', Validators.required ],
      description: [ 'Description', Validators.required ]
    });
  }

  addInputPlatform = () => {
    (this.form.controls['platforms'] as FormArray).push(this.createPlatform());
  }

  addInputMode = () => {
    (this.form.controls['modes'] as FormArray).push(this.createMode());
  }

  addInputRule = () => {
    (this.form.controls['rules'] as FormArray).push(this.createMode());
  }

  public createGame = () => {
    this.GameService.newGame( this.form.value.name, this.form.value.platforms, this.form.value.modes, this.form.value.rules )
    .then( apiResponse => {
      console.log(apiResponse);
      this.Router.navigate([ '/' ])
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.initForm();
  }

}
