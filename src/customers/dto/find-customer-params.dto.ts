import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { PopulateCustomerDto } from './populate-customer.dto';
import { CustomerFiltersDto } from './customer-filters.dto';

export class FindCustomersParamsDto {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PopulateCustomerDto)
  populate?: PopulateCustomerDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerFiltersDto)
  filters?: CustomerFiltersDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationParams)
  pagination?: PaginationParams;
}
