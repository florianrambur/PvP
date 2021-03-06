import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  template: `
      <ion-content>
        <div class="divCenter textCenter" id="flashMessage">
          <span id="flashMessageContent"></span>
          <ion-icon id="closeFlashMessage" mode="ios" name="close-circle"></ion-icon>
        </div>
        <router-outlet></router-outlet>
      </ion-content>
    `
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      } else {
        this.statusBar.styleDefault();
      }
      this.splashScreen.hide();
    });
  }
}
