import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';
import { GameService } from '../../services/game/game.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  providers: [ SearchService, GameService, UtilsService ],
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {

  public form: FormGroup;
  public toggleFields;
  public toggleMessage;
  public gamesCollection: any[];
  public gameSelected: Object;

  public range = {
    "minimumPlayer": 2,
    "maximumPlayer": 16
  }

  constructor(
    private FormBuilder: FormBuilder,
    private GameService: GameService,
    private UtilsService: UtilsService,
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

  public toggleForm = () => {
    this.toggleFields = document.getElementById('toggleFields');
    this.toggleMessage = document.getElementById('toggleForm');

    if (this.toggleFields.style.display == 'none') {
      this.UtilsService.slideDown(this.toggleFields, 500);
      this.toggleMessage.innerHTML = 'Moins de filtre';
    } else {
      this.UtilsService.slideUp(this.toggleFields, 500);
      this.toggleMessage.innerHTML = 'Plus de filtre';
    }
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
    .then( apiResponse => { 
      this.resultsCollection = apiResponse.data; 
      console.log(apiResponse.data);
    } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() {
    this.initForm();
    this.getGames();
  }

}
