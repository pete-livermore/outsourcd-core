import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { WelcomeUserDataDto } from './dto/welcome-user-data.dto';
import { DynamicEmailData, EmailDataType } from './dto/email-data.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationsService {
  constructor(private emailService: EmailService) {}

  async sendWelcomeEmail(userData: WelcomeUserDataDto) {
    const data = plainToInstance(DynamicEmailData, {
      type: EmailDataType.DYNAMIC,
      to: userData.email,
      templateId: '',
      dynamicTemplateData: {},
    });

    return this.emailService.send({ data });
  }

  sendAdminNotification() {}
}
