import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CompanyFiltersDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  sector?: number;
}
