import { Expose } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { EMPLOYMENT_TYPES } from '../constants/employment-types';
import { LOCATION_TYPES } from '../constants/location-types';

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
}
