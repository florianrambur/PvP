import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game/game.service';
import { ChampionshipService } from '../../services/championship/championship.service';
import { AuthService } from '../../services/auth/auth.service';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  providers: [ GameService, ChampionshipService, AuthService, UtilsService ],
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private GameService: GameService,
    private ChampionshipService: ChampionshipService, 
    private AuthService: AuthService, 
    private UtilsService: UtilsService) { }

  public isLogged: Boolean = false;
  public gamesCollection: any[];
  public championshipsCollection: any[];
  public userInformations;

  public displayChampionships = () => {
    this.ChampionshipService.getAllChampionships()
    .then( apiResponse => { this.championshipsCollection = apiResponse.data.reverse().slice(0, 5) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  public displayGames = () => {
    this.GameService.getAllGames()
    .then( apiResponse => {this.gamesCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  public getUserInfos = () => {
    if ((<HTMLInputElement>document.getElementById('currentUserId')).value != "") {
      this.AuthService.getUserById((<HTMLInputElement>document.getElementById('currentUserId')).value)
      .then(apiResponse => { this.isLogged = true; this.userInformations = apiResponse.data; console.log(this.userInformations); } )
      .catch(apiResponse => console.error(apiResponse));
    }
  }

  ngOnInit() {
    this.displayGames();
    this.displayChampionships();
    this.getUserInfos();
  }

}
