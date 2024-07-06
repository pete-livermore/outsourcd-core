import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterParams {
  @ApiPropertyOptional()
  @IsOptional()
  filters?: { [key: string]: string | number | boolean | object };
}
