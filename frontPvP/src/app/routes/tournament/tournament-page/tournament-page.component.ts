import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService } from '../../../services/tournament/tournament.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Location } from '@angular/common';

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
    private Router: Router,
    private _location: Location
  ) { }

  private tournamentId: String;
  public pourcentageRegister;
  public tournamentInformation;

  backClicked() {
    this._location.back();
  }

  private getTournamentInformation = () => {
    this.tournamentId = this.route.snapshot.paramMap.get('id');
    return this.TournamentService.getOneTournament(this.tournamentId)
    .then( apiResponse => { 
      this.tournamentInformation = apiResponse.data; 
      this.pourcentageRegister = apiResponse.data.tournament.registerList.length / apiResponse.data.tournament.nbPlayers * 100;
      console.log(this.tournamentInformation);
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  addOrRemovePlayer = (pTournamentId) => {
    // this.tournamentId = this.route.snapshot.paramMap.get('id');
    return this.TournamentService.registerOrUnsubscribeToTheTournament(pTournamentId)
    .then( apiResponse => {
      this.getTournamentInformation();
      this.UtilsService.flashMessage('success', 'Vous vous êtes désinscrits/inscrits avec succès !');
    })
    .catch( apiResponse => {
      console.error(apiResponse);
      this.UtilsService.flashMessage('error', 'Une erreur s\'est produite durant l\'inscription');
    } )
  }

  ngOnInit() {
    this.getTournamentInformation();
  }

}
