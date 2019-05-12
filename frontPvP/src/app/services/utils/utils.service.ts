import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _location: Location) { }

  public isLogged;
  public currentUserId;

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

  public slideDown = (obj, speed) => {
    var mySpeed = speed || 300;
    var intervals = mySpeed / 30;
    var holder = document.createElement('div');//
    var parent = obj.parentNode;
    holder.setAttribute('style', 'height: 0px; overflow:hidden');
    parent.insertBefore(holder, obj);
    holder.appendChild(obj);
    obj.style.display = obj.getAttribute("data-original-display") || "";
    var height = obj.offsetHeight;
    var sepHeight = height / intervals;
    var timer = setInterval(function() {
      var holderHeight = holder.offsetHeight;
      if (holderHeight + sepHeight < height) {
          holder.style.height = (holderHeight + sepHeight) + 'px';
      } else {
          // clean up
          holder.removeChild(obj);
          parent.insertBefore(obj, holder);
          parent.removeChild(holder);
          clearInterval(timer);
      }
    }, 30);
  }

  public slideUp = (obj, speed) => {
    var mySpeed = speed || 300;
    var intervals = mySpeed / 30;
    var height = obj.offsetHeight;
    var holder = document.createElement('div');//
    var parent = obj.parentNode;
    holder.setAttribute('style', 'height: ' + height + 'px; overflow:hidden');
    parent.insertBefore(holder, obj);
    holder.appendChild(obj);
    var originalDisplay = (obj.style.display !== 'none') ? obj.style.display : '';
    obj.setAttribute("data-original-display", originalDisplay);
    var sepHeight = height / intervals;
    var timer = setInterval(function() {
      var holderHeight = holder.offsetHeight;
      if (holderHeight - sepHeight > 0) {
          holder.style.height = (holderHeight - sepHeight) + 'px';
      } else {
          // clean up
          obj.style.display = 'none';
          holder.removeChild(obj);
          parent.insertBefore(obj, holder);
          parent.removeChild(holder);
          clearInterval(timer);
      }
    }
    , 30);
  }

  public encodeImageFileAsURL = (element) => {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log('RESULT', reader.result)
    }
    reader.readAsDataURL(file);
  }

  public sortByKey(array, key) {
    return array.sort(function (b, a) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }

  public setIsLogged = (value) => {
    this.isLogged = value;
  }

  public checkIsLogged = () => {
    return this.isLogged;
  }

  public setCurrentUserId = (value) => {
    this.currentUserId = value;
  }

  public getCurrentUserId = () => {
    return this.currentUserId;
  }

}
