import { Component, OnInit, NgModule } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ChampionshipService } from '../../../services/championship/championship.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-championship-match-modal',
  templateUrl: './championship-match-modal.page.html',
  providers: [ AuthService, ChampionshipService, UtilsService ],
  styleUrls: ['./championship-match-modal.page.scss'],
})
export class ChampionshipMatchModalPage implements OnInit {

  constructor(
    private FormBuilder: FormBuilder,
    private navParams: NavParams, 
    private modalCtrl: ModalController,
    private ChampionshipService: ChampionshipService,
    private AuthService: AuthService,
    private UtilsService: UtilsService
  ) { }

  public form: FormGroup;
  public championshipId = this.navParams.get('championshipId');
  public idMatch = this.navParams.get('matchId');
  public playerA = this.navParams.get('playerA');
    public playerAInfo;
  public playerB = this.navParams.get('playerB');
  public playerBInfo;
  public isFinish = this.navParams.get('isFinish');

  private getPlayerAInfos = () => {
    this.AuthService.getUserById(this.playerA)
    .then( apiResponse => this.playerAInfo = apiResponse.data)
    .catch( apiResponse => console.error(apiResponse) );
  }

  private getPlayerBInfos = () => {
    this.AuthService.getUserById(this.playerB)
    .then( apiResponse => this.playerBInfo = apiResponse.data)
    .catch( apiResponse => console.error(apiResponse) );
  }

  private initForm = () => {
    this.form = this.FormBuilder.group({
      scorePlayerA: [this.navParams.get('scorePlayerA'), Validators.required],
      scorePlayerB: [this.navParams.get('scorePlayerB'), Validators.required]
    });
  }

  public updateScore = () => {
    this.ChampionshipService.updateScore(this.championshipId, this.idMatch, this.playerA, this.form.value.scorePlayerA, this.playerB, this.form.value.scorePlayerB)
    .then( apiResponse => { 
      console.log(apiResponse.data);
      this.UtilsService.flashMessage('success', 'Les scores ont été mis à jour avec succès');
    } )
    .catch( apiResponse => console.error(apiResponse) );
  }

  ngOnInit() { 
    this.initForm();
    this.getPlayerAInfos();
    this.getPlayerBInfos();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
