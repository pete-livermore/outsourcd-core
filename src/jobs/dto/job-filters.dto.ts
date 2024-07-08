import { Expose, Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { EMPLOYMENT_TYPES } from '../constants/employment-types';
import { LOCATION_TYPES } from '../constants/location-types';
import { DateFilter } from 'src/common/dto/date-filter.dto';

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
}
