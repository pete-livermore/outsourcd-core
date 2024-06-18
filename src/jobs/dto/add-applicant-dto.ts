import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddApplicantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
