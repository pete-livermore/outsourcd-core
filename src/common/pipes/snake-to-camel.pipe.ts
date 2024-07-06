import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SnakeCaseToCamelCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && !Array.isArray(value)) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const camelCaseKey = key.replace(/_([a-z])/g, (g) =>
            g[1].toUpperCase(),
          );

          if (value[key] instanceof Object && !Array.isArray(value[key])) {
            value[camelCaseKey] = this.transform(value[key], metadata);
          } else {
            value[camelCaseKey] = value[key];
          }

          if (camelCaseKey !== key) {
            delete value[key];
          }
        }
      }
    }
    return value;
  }
}
