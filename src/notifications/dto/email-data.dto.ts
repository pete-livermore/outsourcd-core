import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum EmailDataType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
}

export class BaseEmailData {
  @IsEmail()
  to: string;

  @IsEnum(EmailDataType)
  type: EmailDataType;
}

class StaticEmailData extends BaseEmailData {
  type: EmailDataType.STATIC;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}

export class DynamicEmailData extends BaseEmailData {
  type: EmailDataType.DYNAMIC;

  @IsString()
  templateId: string;

  @IsObject()
  dynamicTemplateData: Record<string, any>;
}

export class EmailDataDto {
  @ValidateNested()
  @Type(() => BaseEmailData, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: StaticEmailData, name: 'static' },
        { value: DynamicEmailData, name: 'dynamic' },
      ],
    },
  })
  data: StaticEmailData | DynamicEmailData;
}
