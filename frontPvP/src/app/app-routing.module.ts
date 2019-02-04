import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import components used in the routes
import { HomePageComponent } from "./routes/home-page/home-page.component";
import { SignupPageComponent } from "./routes/signup-page/signup-page.component";
import { LoginPageComponent } from "./routes/login-page/login-page.component";
import { CreateGamePageComponent } from './routes/game/create-game-page/create-game-page.component';
import { GamePageComponent } from './routes/game/game-page/game-page.component';
import { TutorialPageComponent } from './routes/tutorial-page/tutorial-page.component';

const routes: Routes = [
  { path: '', loadChildren: './routes/tabs/tabs.module#TabsPageModule' },
  //{ path: '', component: HomePageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'game/fiche/:id', component: GamePageComponent },
  { path: 'tutorial', component: TutorialPageComponent}
  //{ path: 'game/new', component: CreateGamePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
