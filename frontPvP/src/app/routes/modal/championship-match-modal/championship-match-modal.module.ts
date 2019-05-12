import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChampionshipMatchModalPage } from './championship-match-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChampionshipMatchModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChampionshipMatchModalPage]
})
export class ChampionshipMatchModalPageModule {}
