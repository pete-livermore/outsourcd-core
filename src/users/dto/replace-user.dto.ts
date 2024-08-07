import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ReplaceUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  biography: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  role: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isConfirmed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  profileImage?: number;
}
