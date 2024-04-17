import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationService {
  formatValidationErrors(errors: ValidationError[]): string {
    const errorMessages = errors.reduce(
      (acc: string[], error: ValidationError) => {
        if (error.constraints) {
          acc.push((Object as any).values(error.constraints));
        } else if (error.children) {
          acc.push(this.formatValidationErrors(error.children));
        }
        return acc;
      },
      [],
    );
    return errorMessages.join('; ');
  }

  async validateDto<T extends object>(
    data: Record<string, any>,
    type: new () => T,
    skipMissingProperties = false,
  ): Promise<T> {
    const dtoObj = plainToInstance(type, data);

    for (const key in dtoObj) {
      if (
        Object.prototype.hasOwnProperty.call(dtoObj, key) &&
        dtoObj[key] === undefined
      ) {
        delete dtoObj[key];
      }
    }

    const errors = await validate(dtoObj, { skipMissingProperties });

    if (errors.length) {
      throw new BadRequestException(this.formatValidationErrors(errors));
    }

    return dtoObj;
  }
}
