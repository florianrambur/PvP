import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChampionshipService } from '../../../services/championship/championship.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-championship-page',
  templateUrl: './championship-page.component.html',
  providers: [ ChampionshipService, UtilsService, AuthService ],
  styleUrls: ['./championship-page.component.scss'],
})
export class ChampionshipPageComponent implements OnInit {

  constructor(
    private ChampionshipService: ChampionshipService,
    private UtilsService: UtilsService,
    private AuthService: AuthService,
    private route: ActivatedRoute,
    private Router: Router,
    private _location: Location
  ) { }

  private championshipId: String;
  public pourcentageRegister;
  public championshipInformation;

  backClicked() {
    this._location.back();
  }

  private getChampionshipInformation = () => {
    this.championshipId = this.route.snapshot.paramMap.get('id');
    return this.ChampionshipService.getOneChampionship(this.championshipId)
    .then( apiResponse => { 
      this.championshipInformation = apiResponse.data;
      this.pourcentageRegister = apiResponse.data.championship.registerList.length / apiResponse.data.championship.nbPlayers * 100;
      console.log(this.championshipInformation);
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  addOrRemovePlayer = (pChampionshipId) => {
    return this.ChampionshipService.registerOrUnsubscribeToTheChampionship(pChampionshipId)
    .then( apiResponse => {
      console.log(apiResponse);
      this.Router.navigate([ '/' ]);
      this.UtilsService.flashMessage('success', 'Vous vous êtes inscrits avec succès !');
    })
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.getChampionshipInformation();
  }

}
