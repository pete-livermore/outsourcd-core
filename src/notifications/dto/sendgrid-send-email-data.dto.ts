import { MailContent } from '@sendgrid/helpers/classes/mail';

export class SendEmailDataDto {
  to: string;
  from: string;
  subject?: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  content: MailContent[] & { 0: MailContent };
}
