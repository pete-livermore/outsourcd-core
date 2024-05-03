import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PopulateCompanyDto {
  @Expose()
  @IsOptional()
  sector?: boolean;

  @Expose()
  @IsOptional()
  logo?: boolean;
}
