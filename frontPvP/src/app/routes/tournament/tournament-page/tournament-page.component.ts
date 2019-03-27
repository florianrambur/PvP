import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService } from '../../../services/tournament/tournament.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-tournament-page',
  templateUrl: './tournament-page.component.html',
  providers: [ TournamentService, UtilsService ],
  styleUrls: ['./tournament-page.component.scss']
})
export class TournamentPageComponent implements OnInit {

  constructor(
    private TournamentService: TournamentService,
    private UtilsService: UtilsService,
    private route: ActivatedRoute,
    private Router: Router
  ) { }

  private tournamentId: String;
  public tournamentInformation;

  private getTournamentInformation = () => {
    this.tournamentId = this.route.snapshot.paramMap.get('id');
    return this.TournamentService.getOneTournament(this.tournamentId)
    .then( apiResponse => { 
      this.tournamentInformation = apiResponse.data; 
      console.log(this.tournamentInformation);
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  addOrRemovePlayer = (pTournamentId) => {
    // this.tournamentId = this.route.snapshot.paramMap.get('id');
    return this.TournamentService.registerOrUnsubscribeToTheTournament(pTournamentId)
    .then( apiResponse => {
      console.log(apiResponse);
      this.Router.navigate([ '/' ]);
      this.UtilsService.flashMessage('success', 'Vous vous êtes inscrits avec succès !');
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.getTournamentInformation();
  }

}
