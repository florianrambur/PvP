import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  providers: [ GameService ],
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private GameService: GameService) { }

  public gamesCollection: any[];

  public displayGames = () => {
    this.GameService.getAllGames()
    .then( apiResponse => {this.gamesCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.displayGames();
  }

}
