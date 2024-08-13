import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { EMPLOYMENT_TYPES } from '../constants/employment-types';
import { LOCATION_TYPES } from '../constants/location-types';
import { DateFilter } from 'src/common/dto/date-filter.dto';

class LocationFilterDto {
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  value: number;

  @IsNumber(
    {},
    { each: true, message: 'Each coordinate value should be a number' },
  )
  @IsNotEmpty()
  @ArrayNotEmpty()
  @Transform(({ value }) => value.map((v) => parseInt(v)))
  coordinates: number[];
}

export class JobFiltersDto {
  @Expose()
  @IsOptional()
  @IsArray()
  @IsIn(EMPLOYMENT_TYPES, { each: true })
  employmentTypes?: typeof EMPLOYMENT_TYPES;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsIn(LOCATION_TYPES, { each: true })
  locationTypes?: typeof LOCATION_TYPES;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilter)
  startDate?: DateFilter;

  @Expose()
  @ValidateNested()
  @Type(() => LocationFilterDto)
  withinDistance?: LocationFilterDto;
}
