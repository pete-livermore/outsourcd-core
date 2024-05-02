import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PopulateRoleDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  permissions?: boolean;
}

export class FindRolesParamsDto {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PopulateRoleDto)
  populate?: PopulateRoleDto;
}
