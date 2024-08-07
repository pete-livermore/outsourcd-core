import {
  forwardRef,
  Inject,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createFileValidators } from 'src/uploads/file-validators.factory';

export class DynamicParseFilePipe implements PipeTransform {
  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
  ) {}

  async transform(value: any) {
    const pipe = new ParseFilePipe({
      validators: createFileValidators(this.configService),
    });
    return pipe.transform(value);
  }
}
