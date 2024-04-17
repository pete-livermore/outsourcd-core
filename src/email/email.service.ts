import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly Logger = new Logger(EmailService.name);

  constructor(
    private mailClient: MailService,
    private configService: ConfigService,
  ) {}

  async sendEmail({ to, subject, text, html }: EmailData) {
    const msg = {
      to,
      from: this.configService.get<string>('EMAIL_FROM'),
      subject,
      text,
      html,
    };

    try {
      await this.mailClient.send(msg);
    } catch (e) {
      this.Logger.error(`Email not sent tp ${to}`);
      throw e;
    }
  }
}
