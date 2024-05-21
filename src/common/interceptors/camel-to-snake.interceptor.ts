import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CamelCaseToSnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        function camelToSnake<T = any>(value: T) {
          if (value === null || value === undefined) {
            return value;
          }
          if (Array.isArray(value)) {
            return value.map(camelToSnake);
          }

          if (typeof value === 'object' && !(value instanceof Date)) {
            return Object.fromEntries(
              Object.entries(value).map(([key, value]) => [
                key
                  .split(/(?=[A-Z])/)
                  .join('_')
                  .toLowerCase(),
                camelToSnake(value),
              ]),
            );
          }
          return value;
        }

        return camelToSnake(data);
      }),
    );
  }
}
