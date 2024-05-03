import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PopulateUserDto } from './populate-user.dto';
import { UserFiltersDto } from './user-filters.dto';
import { FindEntityParams } from 'src/common/dto/find-entity-params.dto';

export class FindUsersParamsDto extends FindEntityParams {
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
}
