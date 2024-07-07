import { Expose, Transform } from 'class-transformer';
import {
  FILTER_OPERATOR_PARAMS,
  FilterOperatorParam,
} from '../constants/filter-operators-params';
import { IsIn, IsInt, IsString, Min } from 'class-validator';

export class NumericFilterDto {
  @Expose()
  @IsInt()
  @Min(0)
  @Transform(({ value }) =>
    typeof value !== 'string' ? value : parseInt(value),
  )
  value: number;

  @Expose()
  @IsString()
  @IsIn(FILTER_OPERATOR_PARAMS)
  operator: FilterOperatorParam;
}
