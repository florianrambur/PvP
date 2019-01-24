/* 
Import and definition
*/
  // Basic interfaces to declare an Angular Module
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';

  // Import the interface to enable HTTP request (need to be add in "imports" array)
  import { HttpClientModule } from '@angular/common/http';

  // Import the iterface to create a router (need to be add in "imports" array)
  import { RouterModule } from '@angular/router';

  // Import the application router (need to be associated to "RouterModule")
  import { MainRouter } from "./app.router";

  // Import form interfaces for complete form ability (need to be add in "imports" array)
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';

  // Import the main appication component (need to be add in "declarations" array)
  import { AppComponent } from './app.component';

  // Import the route components (need to be add in "declarations" array)
  import { HomePageComponent } from './routes/home-page/home-page.component';
  import { SignupPageComponent } from './routes/signup-page/signup-page.component';
  import { MePageComponent } from './routes/me-page/me-page.component';
  import { HeaderComponent } from './shared/header/header.component';
  import { LoginPageComponent } from './routes/login-page/login-page.component';
  import { SendMessageChatPageComponent } from './routes/send-message-chat-page/send-message-chat-page.component';
  import { CreateGamePageComponent } from './routes/game/create-game-page/create-game-page.component';
//


/* 
Config and export
*/
  // Config
  @NgModule({
    declarations: [ // All used component need to be declared in the "declarations" array
      AppComponent,
      HomePageComponent,
      SignupPageComponent,
      MePageComponent,
      HeaderComponent,
      LoginPageComponent,
      SendMessageChatPageComponent,
      CreateGamePageComponent
    ],
    imports: [ // All used module need to be declared in the "imports" array
      BrowserModule,
      HttpClientModule,
      RouterModule.forRoot(MainRouter), // Use "RouterModule" to define "MainRouter" has root router
      FormsModule, 
      ReactiveFormsModule
    ],
    providers: [], // Global provider can be declared in the "providers" array
    bootstrap: [ AppComponent ] // Boostrap property is used to deploy application
  })

  // Export
  export class AppModule { }
//
