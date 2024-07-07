import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { snakeToCamelKeys } from '../utils/data/data-transformers';

@Injectable()
export class ParseSnakeCasePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return snakeToCamelKeys(value);
  }
}
