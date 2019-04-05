import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _location: Location) { }

  public backClicked = () => {
    this._location.back();
  }

  public flashMessage = (type: String, message: string) => {
    let div = document.getElementById('flashMessage');
    let content = document.getElementById('flashMessageContent');
    content.innerHTML = message;
    div.className = 'divCenter textCenter';
    div.style.visibility = 'visible';

    switch(type) {
      case 'error':
        div.classList.add('errorMessage');
        break;
      case 'success':
        div.classList.add('successMessage');
        break;
      case 'warning':
        div.classList.add('warningMessage');
        break;
    }

    setTimeout(() => {
      div.style.visibility = 'hidden';
    }, 3000);
  }
}
