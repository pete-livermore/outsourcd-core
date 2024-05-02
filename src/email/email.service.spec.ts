import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@sendgrid/mail';

import { EmailService } from './email.service';
import { mockEmailService } from './test-utils/email.service.mock';
import { mockMailClient } from './test-utils/mail.client.mock';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: MailService, useValue: mockMailClient },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
