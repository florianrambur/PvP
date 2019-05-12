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
import { IonicStorageModule } from '@ionic/storage';

// Personnal component
import { TutorialPageComponent } from './routes/tutorial-page/tutorial-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginPageComponent } from './routes/login-page/login-page.component';
import { SignupPageComponent } from './routes/signup-page/signup-page.component';
import { GamePageComponent } from './routes/game/game-page/game-page.component';
import { GamesPageComponent } from './routes/game/games-page/games-page.component';
import { CreateGamePageComponent } from './routes/game/create-game-page/create-game-page.component';
import { UpdateGamePageComponent } from './routes/game/update-game-page/update-game-page.component';
import { CreateTournamentPageComponent } from './routes/tournament/create-tournament-page/create-tournament-page.component';
import { TournamentsPageComponent } from './routes/tournament/tournaments-page/tournaments-page.component';
import { TournamentPageComponent } from './routes/tournament/tournament-page/tournament-page.component';
import { CreateChampionshipPageComponent } from './routes/championship/create-championship-page/create-championship-page.component';
import { ChampionshipsPageComponent } from './routes/championship/championships-page/championships-page.component';
import { ChampionshipPageComponent } from './routes/championship/championship-page/championship-page.component';
import { UserModalPageModule } from './routes/modal/user-modal/user-modal.module';
import { ChampionshipMatchModalPageModule } from './routes/modal/championship-match-modal/championship-match-modal.module';

// Utils
import { UtilsService } from './services/utils/utils.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    SignupPageComponent, 
    GamesPageComponent, GamePageComponent, CreateGamePageComponent, UpdateGamePageComponent,
    TutorialPageComponent, 
    CreateTournamentPageComponent, TournamentsPageComponent, TournamentPageComponent,
    CreateChampionshipPageComponent, ChampionshipsPageComponent, ChampionshipPageComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    FormsModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    UserModalPageModule,
    ChampionshipMatchModalPageModule
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
