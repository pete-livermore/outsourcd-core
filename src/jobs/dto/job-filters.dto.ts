import { Expose, Type } from 'class-transformer';
import { IsIn, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { EMPLOYMENT_TYPES } from '../constants/employment-types';
import { LOCATION_TYPES } from '../constants/location-types';

class LocationFiltersDto {
  @Expose()
  @IsOptional()
  @IsIn(LOCATION_TYPES)
  type?: string;
}

export class JobFiltersDto {
  @Expose()
  @IsOptional()
  @IsIn(EMPLOYMENT_TYPES)
  employmentType?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationFiltersDto)
  location?: LocationFiltersDto;
}
