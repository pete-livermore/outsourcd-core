import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PopulateCustomerDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  orders?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  image?: boolean;
}
