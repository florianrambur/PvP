import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from '../../services/utils/utils.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserModalPage } from '../modal/user-modal/user-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public isLogged = this.UtilsService.checkIsLogged();
  public currentUserId = this.UtilsService.getCurrentUserId();

  constructor(
    public UtilsService: UtilsService,
    public AuthService: AuthService,
    private modalCtrl: ModalController,
    public Router: Router
    ) {}

  public signOut = () => {
    this.AuthService.signOut()
    .then(response => {
      this.Router.navigate(['/login']);
      this.UtilsService.flashMessage('success', 'Vous vous êtes déconnecté avec succès !');
    } );
  }

  async openUserModal(userId) {
    const modal = await this.modalCtrl.create({
      component: UserModalPage,
      componentProps: { userId: userId }
    });

    return await modal.present();
  }

  public toggleMenu = () => {
    const sideMenu = document.getElementById('sideMenu');

    if (sideMenu.style.display == 'none') {
      sideMenu.style.display = 'block';
    } else {
      sideMenu.style.display = 'none';
    }
  } 
}
