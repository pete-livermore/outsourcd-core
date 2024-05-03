import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginationParams } from 'src/common/dto/pagination-params';

export class FindEntityParams {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationParams)
  pagination?: PaginationParams;
}
