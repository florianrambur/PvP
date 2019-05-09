import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public UtilsService: UtilsService) {}

  public toggleMenu = () => {
    const sideMenu = document.getElementById('sideMenu');

    if (sideMenu.style.display == 'none') {
      sideMenu.style.display = 'block';
    } else {
      sideMenu.style.display = 'none';
    }
  } 
}
