import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessageChatPageComponent } from './send-message-chat-page.component';

describe('SendMessageChatPageComponent', () => {
  let component: SendMessageChatPageComponent;
  let fixture: ComponentFixture<SendMessageChatPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMessageChatPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
