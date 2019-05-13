import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

import { ChampionshipService } from '../../../services/championship/championship.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { UserModalPage } from '../../modal/user-modal/user-modal.page';
import { ChampionshipMatchModalPage } from '../../modal/championship-match-modal/championship-match-modal.page';

@Component({
  selector: 'app-championship-page',
  templateUrl: './championship-page.component.html',
  providers: [ ChampionshipService, AuthService ],
  styleUrls: ['./championship-page.component.scss'],
})
export class ChampionshipPageComponent implements OnInit {

  constructor(
    private ChampionshipService: ChampionshipService,
    private UtilsService: UtilsService,
    private AuthService: AuthService,
    private route: ActivatedRoute,
    private Router: Router,
    private _location: Location,
    private modalCtrl: ModalController
  ) { }

  private championshipId: String;
  public pourcentageRegister;
  public championshipInformation;
  public leader;
  public canBeClosed: Boolean = true;
  public isLogged;
  public currentUserId;
  public isRegistered;
  public isOwner = false;

  backClicked() {
    this._location.back();
  }

  private getChampionshipInformation = () => {
    let $this = this;

    this.championshipId = this.route.snapshot.paramMap.get('id');
    return this.ChampionshipService.getOneChampionship(this.championshipId)
    .then( apiResponse => { 
      this.championshipInformation = apiResponse.data;
      this.championshipInformation.championship.ranking = this.UtilsService.sortByKey(this.championshipInformation.championship.ranking, 'points');

      this.pourcentageRegister = apiResponse.data.championship.registerList.length / apiResponse.data.championship.nbPlayers * 100;

      if (this.championshipInformation.championship.matches.length == 0) {
        $this.canBeClosed = false;
      }

      this.championshipInformation.championship.matches.forEach(function(match) {
        if (match.scorePlayerA == null || match.scorePlayerB == null) {
          $this.canBeClosed = false;
        }
      });

      this.isLogged = this.UtilsService.checkIsLogged();
      this.currentUserId = this.UtilsService.getCurrentUserId();
      this.isRegistered = this.championshipInformation.championship.registerList.includes(this.currentUserId);
      
      if (this.championshipInformation.championship.author == this.currentUserId) {
        this.isOwner = true;
      }

      this.AuthService.getUserById(this.championshipInformation.MVP.playerId)
      .then( apiResponse => this.leader = apiResponse.data.pseudo )
      .catch( apiResponse => console.error(apiResponse) );

      this.championshipInformation.championship.matches.forEach(match => {
        this.AuthService.getUserById(match.playerA)
        .then( apiResponse => match.pseudoA = apiResponse.data.pseudo )
        .catch( apiResponse => console.error(apiResponse) );
      });

      this.championshipInformation.championship.matches.forEach(match => {
        this.AuthService.getUserById(match.playerB)
        .then( apiResponse => match.pseudoB = apiResponse.data.pseudo )
        .catch( apiResponse => console.error(apiResponse) );
      });

      this.championshipInformation.championship.ranking.forEach(playerRanking => {
        this.AuthService.getUserById(playerRanking.playerId)
        .then( apiResponse => playerRanking.pseudo = apiResponse.data.pseudo )
        .catch( apiResponse => console.error(apiResponse) );
      });
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  async openUserModal(userId) {
    const modal = await this.modalCtrl.create({
      component: UserModalPage,
      componentProps: { userId: userId }
    });

    return await modal.present();
  }

  async openChampionshipMatchModal(championshipId, matchId, pseudoA, scorePlayerA, pseudoB, scorePlayerB, playerA, playerB, isFinish) {
    const modal = await this.modalCtrl.create({
      component: ChampionshipMatchModalPage,
      componentProps: {
        championshipId: championshipId, 
        matchId: matchId,
        pseudoA: pseudoA,
        scorePlayerA: scorePlayerA,
        pseudoB: pseudoB,
        scorePlayerB: scorePlayerB,
        playerA: playerA,
        playerB: playerB,
        isFinish: isFinish,
        currentUserId: this.currentUserId
      }
    });

    return await modal.present();
  }

  public addPlayer = (pChampionshipId) => {
    return this.ChampionshipService.registerToTheChampionship(pChampionshipId)
    .then( apiResponse => {
      this.getChampionshipInformation();
      this.UtilsService.flashMessage('success', 'Vous vous êtes inscrits avec succès !');
    })
    .catch( apiResponse => {
      console.error(apiResponse.error);
      if (apiResponse.error.error == 'User is already registered') {
        this.UtilsService.flashMessage('error', 'Vous êtes déjà inscrits à ce championnat !');
      }
    })
  }

  public removePlayer = (pChampionshipId) => {
    return this.ChampionshipService.unsubscribeToTheChampionship(pChampionshipId)
    .then( apiResponse => {
      this.getChampionshipInformation();
      this.UtilsService.flashMessage('success', 'Vous vous êtes désinscrits avec succès !');
    })
    .catch( apiResponse => {
      console.error(apiResponse.error);
      if (apiResponse.error.error == 'User is not in this championship') {
        this.UtilsService.flashMessage('error', 'Vous n\'êtes pas inscrit à ce championnat !');
      }
    })
  }

  public closeChampionship = (pChampionshipId) => {
    return this.ChampionshipService.closeChampionship(pChampionshipId)
    .then( apiResponse => {
      const button = document.getElementById('lockChampionship');
      button.setAttribute('disabled', 'disabled');
      this.getChampionshipInformation();
      this.UtilsService.flashMessage('success', 'Le championnat a été clos avec succès');
    })
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() {
    this.getChampionshipInformation();
  }

}
