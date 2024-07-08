import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsString,
  isDateString,
} from 'class-validator';
import { DATE_OPERATORS, DateOperator } from '../constants/filter-operator-map';

export class DateFilter {
  @Transform(({ value }) => {
    const isValidDate = isDateString(value, {
      strict: true,
    });

    if (!isValidDate) {
      return value;
    }
    return new Date(value);
  })
  @IsDate()
  @IsNotEmpty()
  value: Date;

  @Expose()
  @IsString()
  @IsIn(DATE_OPERATORS)
  operator: DateOperator;
}
