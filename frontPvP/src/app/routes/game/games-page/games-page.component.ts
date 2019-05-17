import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/game/game.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  providers: [ GameService ],
  styleUrls: ['./games-page.component.scss']
})
export class GamesPageComponent implements OnInit {

  constructor(private GameService: GameService, 
    private _location: Location) { }

  public gamesCollection: any[];

  backClicked() {
    this._location.back();
  }

  public displayGames = () => {
    this.GameService.getAllGames()
    .then( apiResponse => {this.gamesCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.displayGames();
  }

}
