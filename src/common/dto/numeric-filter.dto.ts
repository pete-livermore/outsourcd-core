import { Expose, Transform } from 'class-transformer';
import { IsIn, IsInt, IsString, Min } from 'class-validator';
import {
  NUMERIC_OPERATORS,
  NumericOperator,
} from '../constants/filter-operator-map';

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
  @IsIn(NUMERIC_OPERATORS)
  operator: NumericOperator;
}
