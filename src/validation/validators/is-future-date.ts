import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isFuture } from 'date-fns';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: string | Date) {
    return isFuture(new Date(date));
  }

  defaultMessage() {
    return 'Date must be in the future';
  }
}

export function IsFutureDate() {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: IsFutureDateConstraint,
    });
  };
}
