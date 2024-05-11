import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { ValidationService } from 'src/validation/validation.service';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [
    ValidationService,
    {
      provide: EmailService,
      useFactory: (
        configService: ConfigService,
        validationService: ValidationService,
      ) => {
        const apiKey = configService.get<string>('SENDGRID_API_KEY');
        sgMail.setApiKey(apiKey);
        return new EmailService(sgMail, configService, validationService);
      },
      inject: [ConfigService],
    },
    NotificationsService,
  ],
})
export class NotificationsModule {}
