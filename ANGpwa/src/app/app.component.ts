/* 
Imports
*/
  // The "Component" interface is needed to declare a component
  import { Component } from '@angular/core';
//

/* 
Definition and export

*/
  // Definition
  @Component({
    // The name of the component selector
    selector: 'app-root',

    // Content of the vue
    template: `
      <app-header></app-header>
      
      <!--
      The "router-outlet" directive is used to define where the route components will be load.
      All components will be load below the "router-outlet" directive (check your dev. console)
      -->
      <router-outlet></router-outlet>
    `
  })

  // Export
  export class AppComponent {
    // It's better to put less code has you can in the main component
  }
//