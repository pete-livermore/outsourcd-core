import { IsIn, IsNotEmpty } from 'class-validator';
import { PERMITTED_ACTIONS } from '../constants/permitted-actions';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsIn(PERMITTED_ACTIONS)
  action: string;

  @IsNotEmpty()
  entity: string;
}
