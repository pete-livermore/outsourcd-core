import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toBool } from './transformers';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PopulateParams {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(toBool)
  populate?: { [key: string]: true };
}
