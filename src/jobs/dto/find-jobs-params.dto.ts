import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PopulateJobDto } from './populate-Job.dto';
import { JobFiltersDto } from './job-filters.dto';
import { FindEntityParams } from 'src/common/dto/find-entity-params.dto';

export class FindJobsParamsDto extends FindEntityParams {
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
}
