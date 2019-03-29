import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from "@angular/router";

import { GameService } from '../../../services/game/game.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-create-game-page',
  templateUrl: './create-game-page.component.html',
  providers: [ GameService ]
})

export class CreateGamePageComponent implements OnInit {

  public form: FormGroup;
  private imageBase64: string;

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    private UtilsService: UtilsService,
    private Router: Router
  ) { }

  private initForm = () => {
    this.form = this.FormBuilder.group({
      name: [ undefined, Validators.required ],
      platforms: this.FormBuilder.array([this.createPlatform()]),
      modes: this.FormBuilder.array([this.createMode()]),
      rules: this.FormBuilder.array([this.createRule()]),
      image: this.imageBase64
    });
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageBase64 = reader.result;
    console.log(this.imageBase64);
  }

  createPlatform = () => {
    return this.FormBuilder.group({
      name: [ undefined, Validators.required ]
    })
  }

  createMode = () => {
    return this.FormBuilder.group({
      name: [ undefined, Validators.required ],
      description: [ undefined, Validators.required ]
    });
  }

  createRule = () => {
    return this.FormBuilder.group({
      name: [ undefined, Validators.required ],
      description: [ undefined, Validators.required ]
    });
  }

  addInputPlatform = () => {
    (this.form.controls['platforms'] as FormArray).push(this.createPlatform());
  }

  addInputMode = () => {
    (this.form.controls['modes'] as FormArray).push(this.createMode());
  }

  addInputRule = () => {
    (this.form.controls['rules'] as FormArray).push(this.createRule());
  }

  deleteInputPlatform = (index: number) => {
    (this.form.controls['platforms'] as FormArray).removeAt(index);
  }

  deleteInputMode = (index: number) => {
    (this.form.controls['modes'] as FormArray).removeAt(index);
  }

  deleteInputRule = (index: number) => {
    (this.form.controls['rules'] as FormArray).removeAt(index);
  }

  public createGame = () => {
    this.GameService.newGame( this.form.value.name, this.form.value.platforms, this.form.value.modes, this.form.value.rules, this.form.value.image )
    .then( apiResponse => {
      console.log(apiResponse);
      this.Router.navigate([ '/game/fiche/', apiResponse.data._id ]);
      this.UtilsService.flashMessage('success', 'Le jeu a été ajouté avec succès! Un modérateur va vérifier la fiche du jeu.');
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.initForm();
  }

}
