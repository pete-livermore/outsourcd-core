import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginationParams } from 'src/app/common/dto/pagination-params';
import { PopulateUserDto } from './populate-user.dto';
import { UserFiltersDto } from './user-filters.dto';

export class FindUsersParamsDto {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PopulateUserDto)
  populate?: PopulateUserDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserFiltersDto)
  filters?: UserFiltersDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationParams)
  pagination?: PaginationParams;
}
