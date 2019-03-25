import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament/tournament.service';

@Component({
  selector: 'app-tournaments-page',
  templateUrl: './tournaments-page.component.html',
  providers: [ TournamentService ],
  styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent implements OnInit {

  constructor(private TournamentService: TournamentService) { }

  public tournamentsCollection: any[];

  public displayTournaments = () => {
    this.TournamentService.getAllTournaments()
    .then( apiResponse => { this.tournamentsCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  ngOnInit() {
    this.displayTournaments();
  }

}
