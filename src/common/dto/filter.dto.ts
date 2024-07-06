import { Expose } from 'class-transformer';
import {
  FILTER_OPERATOR_PARAMS,
  FilterOperatorParam,
} from '../constants/filter-operators-params';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  value: string | number;

  @Expose()
  @IsOptional()
  @IsString()
  @IsIn(FILTER_OPERATOR_PARAMS)
  operator: FilterOperatorParam;
}
