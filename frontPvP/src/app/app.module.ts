import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Personnal component
import { TutorialPageComponent } from './routes/tutorial-page/tutorial-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { GamePageComponent } from './routes/game/game-page/game-page.component';
import { LoginPageComponent } from './routes/login-page/login-page.component';
import { SignupPageComponent } from './routes/signup-page/signup-page.component';

// Utils
import { UtilsService } from './services/utils/utils.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    SignupPageComponent, 
    GamePageComponent, TutorialPageComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
