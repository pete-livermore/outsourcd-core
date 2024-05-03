import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PERMITTED_CURRENCIES } from '../constants/permitted-currencies';
import { SALARY_PERIODS } from '../constants/salary-periods';
import { LOCATION_TYPES } from '../constants/location-types';

class SalaryValueDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  min: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
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
  @IsIn(LOCATION_TYPES)
  location_type: string;
}
