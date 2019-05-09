import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  providers: [ SearchService, GameService ],
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {

  public form: FormGroup;
  public gamesCollection: any[];
  public gameSelected: Object;

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    private SearchService: SearchService
  ) { }

  public resultsCollection: any[];
  public searchFields: Object;

  private initForm = () => {
    this.form = this.FormBuilder.group({
      competition: [undefined, Validators.required],
      game: [undefined],
      online: [undefined],
      nbPlayers: [undefined],
      startDate: [undefined],
      place: [undefined]
    });
  }

  public getGames = () => {
    this.GameService.getAllGames()
    .then( apiResponse => { this.gamesCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  selectedGame = (selectedValue: string) => {
    this.GameService.getOneGame(selectedValue)
    .then( apiResponse => {this.gameSelected = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  public searchCompetition = () => {
    this.searchFields = { "searchFields": this.form.value };
    console.log(this.searchFields);
    this.SearchService.searchCompetition(this.searchFields)
    .then( apiResponse => { this.resultsCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() {
    this.initForm();
    this.getGames();
  }

}
