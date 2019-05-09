import { Component, OnInit, ViewChild } from '@angular/core';
import { TournamentService } from '../../services/tournament/tournament.service';
import { ChampionshipService } from '../../services/championship/championship.service';
import { IonSegment } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-competitions-page',
  templateUrl: './competitions-page.component.html',
  providers: [ TournamentService, ChampionshipService ],
  styleUrls: ['./competitions-page.component.scss'],
})
export class CompetitionsPageComponent implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;

  tournamentsCollection: Observable<any>;
  championshipsCollection: Observable<any>;

  public selectedValue: string;

  constructor(private TournamentService: TournamentService, private ChampionshipService: ChampionshipService) { }

  public displayTournaments = () => {
    this.TournamentService.getAllTournaments()
    .then( apiResponse => { this.tournamentsCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  public displayChampionships = () => {
    this.ChampionshipService.getAllChampionships()
    .then( apiResponse => { this.championshipsCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  segmentChanged(ev: any) {
    this.selectedValue = ev.detail.value;
  }

  ngOnInit() {
    this.displayTournaments();
    this.displayChampionships();
    this.selectedValue = 'tournament';
    this.segment.value = 'tournament';
  }

}
