import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  private parameter: String;
  public tournamentInformation;

  private getTournamentInformation = () => {
    this.parameter = this.route.snapshot.paramMap.get('id');
    return this.TournamentService.getOneTournament(this.parameter)
    .then( apiResponse => { 
      this.tournamentInformation = apiResponse.data; 
      console.log(this.tournamentInformation);
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() {
    this.getTournamentInformation();
  }

}
