import { IsEmail } from 'class-validator';

export class WelcomeUserDataDto {
  @IsEmail()
  email: string;
}
