import { Component, OnInit, ViewChild } from '@angular/core';
import { ChampionshipService } from '../../../services/championship/championship.service';
import { IonSegment } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-championships-page',
  templateUrl: './championships-page.component.html',
  styleUrls: ['./championships-page.component.scss'],
})
export class ChampionshipsPageComponent implements OnInit {

  @ViewChild(IonSegment) segment: IonSegment;

  championshipsCollection: Observable<any>;

  public selectedValue: string;

  constructor(private ChampionshipService: ChampionshipService) { }

  public displayChampionships = () => {
    this.ChampionshipService.getAllChampionships()
    .then( apiResponse => { this.championshipsCollection = apiResponse.data; console.log(apiResponse) } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() {
    this.displayChampionships();
  }

}
