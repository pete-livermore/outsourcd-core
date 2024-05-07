import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PERMITTED_CURRENCIES } from '../constants/permitted-currencies';
import { SALARY_PERIODS } from '../constants/salary-periods';
import { LOCATION_TYPES } from '../constants/location-types';
import { IsFutureDate } from 'src/validation/validators/is-future-date';

class SalaryValueDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  max: number;
}

class JobSalaryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(PERMITTED_CURRENCIES)
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(SALARY_PERIODS)
  @IsString()
  period: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SalaryValueDto)
  value: SalaryValueDto;
}

class JobLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(LOCATION_TYPES)
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  coordinates: number[];
}

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => JobSalaryDto)
  salary: JobSalaryDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsFutureDate()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsOptional()
  @IsFutureDate()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => JobLocationDto)
  location: JobLocationDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  weeklyHours: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  company: number;
}
