import { IsIn, IsOptional, IsString } from 'class-validator';

import { PERMITTED_ACTIONS } from '../constants/permitted-actions';

export class UpdatePermissionDto {
  @IsOptional()
  @IsIn(PERMITTED_ACTIONS)
  action?: string;

  @IsOptional()
  @IsString()
  entity?: string;
}
