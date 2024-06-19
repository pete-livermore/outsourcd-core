import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PopulateJobDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  applications?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  owner?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  company?: boolean;
}
