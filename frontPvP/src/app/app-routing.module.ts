import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import components used in the routes
import { HomePageComponent } from "./routes/home-page/home-page.component";
import { SignupPageComponent } from "./routes/signup-page/signup-page.component";
import { LoginPageComponent } from "./routes/login-page/login-page.component";
import { GamePageComponent } from './routes/game/game-page/game-page.component';
import { GamesPageComponent } from './routes/game/games-page/games-page.component';
import { CreateGamePageComponent } from './routes/game/create-game-page/create-game-page.component';
import { UpdateGamePageComponent } from './routes/game/update-game-page/update-game-page.component';
import { TutorialPageComponent } from './routes/tutorial-page/tutorial-page.component';
import { CreateTournamentPageComponent } from './routes/tournament/create-tournament-page/create-tournament-page.component';
import { TournamentsPageComponent } from './routes/tournament/tournaments-page/tournaments-page.component';
import { TournamentPageComponent } from './routes/tournament/tournament-page/tournament-page.component';
import { CreateChampionshipPageComponent } from './routes/championship/create-championship-page/create-championship-page.component';
import { ChampionshipsPageComponent } from './routes/championship/championships-page/championships-page.component';
import { ChampionshipPageComponent } from './routes/championship/championship-page/championship-page.component';

const routes: Routes = [
  { path: '', loadChildren: './routes/tabs/tabs.module#TabsPageModule' },
  { path: 'tutorial', component: TutorialPageComponent},
  //{ path: '', component: HomePageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'games', component: GamesPageComponent},
  { path: 'game/new', component: CreateGamePageComponent },
  { path: 'game/update/:id', component: UpdateGamePageComponent },
  { path: 'game/fiche/:id', component: GamePageComponent },
  { path: 'tournament/new', component: CreateTournamentPageComponent },
  { path: 'championship/new', component: CreateChampionshipPageComponent },
  { path: 'tournaments', component: TournamentsPageComponent },
  { path: 'championships', component: ChampionshipsPageComponent },
  { path: 'tournament/fiche/:id', component: TournamentPageComponent },
  { path: 'championship/fiche/:id', component: ChampionshipPageComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
