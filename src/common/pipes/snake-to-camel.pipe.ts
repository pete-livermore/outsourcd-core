import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SnakeCaseToCamelCasePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value instanceof Object) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) =>
            g[1].toUpperCase(),
          );
          value[camelCaseKey] = value[key];
          if (camelCaseKey !== key) {
            delete value[key];
          }
        }
      }
    }
    return value;
  }
}
