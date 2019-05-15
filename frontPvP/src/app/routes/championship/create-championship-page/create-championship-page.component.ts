import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ChampionshipService } from '../../../services/championship/championship.service';
import { GameService } from '../../../services/game/game.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-create-championship-page',
  templateUrl: './create-championship-page.component.html',
  providers: [ ChampionshipService, GameService ],
  styleUrls: ['./create-championship-page.component.scss'],
})
export class CreateChampionshipPageComponent implements OnInit {

  public form: FormGroup;
  public gamesCollection: any[];
  public gameSelected: Object;
  public showPlace: string;

  constructor(
    private FormBuilder: FormBuilder,
    private ChampionshipService: ChampionshipService,
    private GameService: GameService,
    public UtilsService: UtilsService,
    private Router: Router,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  public getGames = () => {
    this.GameService.getAllGames()
    .then( apiResponse => {this.gamesCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  selectedGame = (selectedValue: string) => {
    this.GameService.getOneGame(selectedValue)
    .then( apiResponse => {this.gameSelected = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  showPlaceOrNot = (selectedValue: string) => {
    this.showPlace = selectedValue;
  }

  private initForm = () => {
    this.form = this.FormBuilder.group({
      game: [undefined, Validators.required],
      name: [undefined, Validators.required],
      description: [undefined, Validators.required],
      mode: [undefined, Validators.required],
      rules: [undefined, Validators.required],
      platforms: [undefined, Validators.required],
      online: [undefined, Validators.required],
      isPrivate: [undefined, Validators.required],
      nbPlayers: [undefined, [Validators.required, Validators.min(4), Validators.max(32)]],
      startDate: [undefined, Validators.required],
      place: [undefined]
    });
  }

  public createChampionship = () => {
    this.ChampionshipService.newChampionship( 
      this.form.value.game, this.form.value.name, this.form.value.description, 
      this.form.value.mode, this.form.value.rules, this.form.value.platforms, this.form.value.online, 
      this.form.value.isPrivate, this.form.value.nbPlayers, 
      this.form.value.startDate, this.form.value.place)
      .then( apiResponse => {
        this.Router.navigate([ '/championship/fiche/', apiResponse.data._id ]);
        this.UtilsService.flashMessage('success', 'Le championnat a été créé avec succès!');
      })
      .catch( apiResponse => {
        this.UtilsService.flashMessage('error', 'Une erreur est survenue, veuillez ressayer plus tard.');
      })
  }

  ngOnInit() {
    this.initForm();
    this.getGames();
  }

}
