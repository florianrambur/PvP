import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  providers: [ AuthService ],
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  private userId = null;
  public userInformations;

  constructor(
    private AuthService: AuthService,
    private navParams: NavParams, 
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.userId = this.navParams.get('userId');
    this.AuthService.getUserById(this.userId)
    .then(apiResponse => this.userInformations = apiResponse.data )
    .catch(apiResponse => console.error(apiResponse));
   }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
