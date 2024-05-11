import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { DynamicEmailData, EmailDataType } from './dto/email-data.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationsService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(userEmail: string) {
    const data = plainToInstance(DynamicEmailData, {
      type: EmailDataType.DYNAMIC,
      to: userEmail,
      templateId: '',
      dynamicTemplateData: {},
    });

    return this.emailService.send({ data });
  }

  sendAdminNotification() {}
}
