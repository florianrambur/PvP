import { TestBed } from '@angular/core/testing';

import { SendMessageChatService } from './send-message-chat.service';

describe('SendMessageChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendMessageChatService = TestBed.get(SendMessageChatService);
    expect(service).toBeTruthy();
  });
});
