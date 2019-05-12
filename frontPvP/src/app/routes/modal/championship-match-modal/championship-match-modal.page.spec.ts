import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipMatchModalPage } from './championship-match-modal.page';

describe('ChampionshipMatchModalPage', () => {
  let component: ChampionshipMatchModalPage;
  let fixture: ComponentFixture<ChampionshipMatchModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionshipMatchModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipMatchModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
