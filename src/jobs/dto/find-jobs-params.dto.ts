import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { PopulateJobDto } from './populate-Job.dto';
import { JobFiltersDto } from './job-filters.dto';

export class FindJobsParamsDto {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PopulateJobDto)
  populate?: PopulateJobDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => JobFiltersDto)
  filters?: JobFiltersDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationParams)
  pagination?: PaginationParams;
}
