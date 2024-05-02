import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PopulateJobDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  applicants?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  company?: boolean;
}
