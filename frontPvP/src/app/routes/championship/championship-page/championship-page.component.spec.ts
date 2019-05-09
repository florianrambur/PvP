import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipPageComponent } from './championship-page.component';

describe('ChampionshipPageComponent', () => {
  let component: ChampionshipPageComponent;
  let fixture: ComponentFixture<ChampionshipPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionshipPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionshipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
