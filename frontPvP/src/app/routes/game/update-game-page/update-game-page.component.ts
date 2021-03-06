import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

import { GameService } from '../../../services/game/game.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-update-game-page',
  templateUrl: './update-game-page.component.html',
  styleUrls: ['./update-game-page.component.scss'],
  providers: [ GameService ]
})
export class UpdateGamePageComponent implements OnInit {

  // @ViewChild('myFile')
  // myFile: ElementRef;

  public form: FormGroup;
  private imageBase64: string;
  public gameId = this.route.snapshot.paramMap.get('id');
  public gameInformation;

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    public UtilsService: UtilsService,
    private Router: Router,
    private route: ActivatedRoute
  ) { }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
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

  public getGame = () => {
    this.GameService.getOneGame(this.gameId)
    .then( apiResponse => this.gameInformation = apiResponse.data )
    .catch( apiResponse => console.error(apiResponse) );
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

  public updateGame = () => {
    this.GameService.updateGame( this.gameId, this.form.value.name, this.form.value.platforms, this.form.value.modes, this.form.value.rules, this.imageBase64 )
    .then( apiResponse => {
      console.log(apiResponse);
      this.UtilsService.flashMessage('success', 'Le jeu a été mis à jour avec succès!');
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.initForm();
    this.getGame();
  }

}
