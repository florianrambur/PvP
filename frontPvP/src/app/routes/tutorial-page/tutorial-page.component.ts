import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-page',
  templateUrl: './tutorial-page.component.html',
  styleUrls: ['./tutorial-page.component.scss']
})
export class TutorialPageComponent implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }

  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }

  constructor() { }

  ngOnInit() {
  }

}
