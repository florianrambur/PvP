import { Component, OnInit, ViewChild } from '@angular/core';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { IonSegment } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tournaments-page',
  templateUrl: './tournaments-page.component.html',
  providers: [ TournamentService ],
  styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;

  tournamentsCollection: Observable<any>;
  championshipsCollection: Observable<any>;

  public selectedValue: string;

  constructor(private TournamentService: TournamentService) { }

  // public tournamentsCollection: any[];

  public displayTournaments = () => {
    this.TournamentService.getAllTournaments()
    .then( apiResponse => { this.tournamentsCollection = apiResponse.data; console.log(apiResponse.data) } )
    .catch( apiResponse => console.error(apiResponse) )
  }

  segmentChanged(ev: any) {
    this.selectedValue = ev.detail.value;
  }

  ngOnInit() {
    this.displayTournaments();
    this.selectedValue = 'tournament'
    this.segment.value = 'tournament';
  }

}
