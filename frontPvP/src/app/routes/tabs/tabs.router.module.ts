import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home-page/tab1.module#HomePageModule'
          }
        ]
      },
      {
        path: 'competitions',
        children: [
          {
            path: '',
            loadChildren: '../competitions-page/tab2.module#CompetitionsPageModule'
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: '../search-page/tab3.module#SearchPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
