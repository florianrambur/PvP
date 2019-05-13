import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

import { GameService } from '../../../services/game/game.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-create-game-page',
  templateUrl: './create-game-page.component.html',
  providers: [ GameService ],
  styleUrls: [ './create-game-page.component.scss' ]
})

export class CreateGamePageComponent implements OnInit {

  // @ViewChild('myFile')
  // myFile: ElementRef;

  public form: FormGroup;
  public imageName: string;
  private imageBase64: string;

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    public UtilsService: UtilsService,
    private Router: Router,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.imageName = file.name;
    console.log(file);
    btoa(file);
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.UtilsService.flashMessage('error', 'Le format du fichier ne correspond pas. Veuillez sélectionner une image.');
      // this.myFile.nativeElement.value = '';

      return false;
    } else {
      if (file.size > 10000) {
        this.UtilsService.flashMessage('error', 'L\'image sélectionnée est trop lourde.');
        // this.myFile.nativeElement.value = '';

        return false;
      }
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageBase64 = reader.result;
  }

  private initForm = () => {
    this.form = this.FormBuilder.group({
      name: [ undefined, Validators.required ],
      platforms: this.FormBuilder.array([this.createPlatform()]),
      modes: this.FormBuilder.array([this.createMode()]),
      rules: this.FormBuilder.array([this.createRule()]),
      image: this.imageBase64
    });
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
    this.GameService.newGame( this.form.value.name, this.form.value.platforms, this.form.value.modes, this.form.value.rules, this.imageBase64 )
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
