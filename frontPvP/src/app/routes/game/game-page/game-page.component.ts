import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GameService } from '../../../services/game/game.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  providers: [ GameService, UtilsService ]
})
export class GamePageComponent implements OnInit {

  constructor(
    private GameService: GameService,
    public UtilsService: UtilsService, 
    private route: ActivatedRoute, 
    private Router: Router
    ) { }

  private parameter: String;
  public gameInformation;

  private getGameInformation = () => {
    this.parameter = this.route.snapshot.paramMap.get('id');
    return this.GameService.getOneGame(this.parameter)
    .then( apiResponse => { 
      this.gameInformation = apiResponse.data; 
      console.log(this.gameInformation);
    })
    .catch( apiResponse => console.error(apiResponse) );
  }
  
  deleteGame = (id: String) => {
    return this.GameService.deleteGame(id)
    .then( apiResponse => {
      console.log(apiResponse);
      this.Router.navigate([ '/' ]);
      this.UtilsService.flashMessage('success', 'Le jeu a été supprimé avec succès');
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.getGameInformation();
  }

}
