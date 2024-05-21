import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  role: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  profileImage?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isConfirmed: boolean;
}
