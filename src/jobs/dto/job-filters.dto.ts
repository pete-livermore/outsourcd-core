import { Expose } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { EMPLOYMENT_TYPES } from '../constants/employment-types';

export class JobFiltersDto {
  @Expose()
  @IsOptional()
  @IsIn(EMPLOYMENT_TYPES)
  employmentType?: string;
}
