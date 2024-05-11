import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { EmailDataDto, EmailDataType } from './dto/email-data.dto';
import { ValidationService } from 'src/validation/validation.service';
import { plainToInstance } from 'class-transformer';
import { SendEmailDataDto } from './dto/sendgrid-send-email-data.dto';

@Injectable()
export class EmailService {
  private readonly Logger = new Logger(EmailService.name);

  constructor(
    private mailClient: MailService,
    private configService: ConfigService,
    private validationService: ValidationService,
  ) {}

  async send(email: EmailDataDto) {
    await this.validationService.validateDto(email, EmailDataDto);
    const { data } = email;

    const msg = plainToInstance(SendEmailDataDto, {
      to: data.to,
      from: this.configService.get<string>('EMAIL_FROM'),
    });

    if (data.type === EmailDataType.DYNAMIC) {
      msg.templateId = data.templateId;
      msg.dynamicTemplateData = data.dynamicTemplateData;
    } else {
      msg.html = data.html;
      msg.subject = data.subject;
      msg.text = data.text;
    }

    try {
      await this.mailClient.send(msg);
    } catch (e) {
      this.Logger.error(`Email not sent tp ${data.to}`);
      throw e;
    }
  }
}
