import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class UploadFilters {
  @IsOptional()
  mime?: string;

  @IsOptional()
  ext?: string;
}

export class FindUploadOptionsDto {
  @ValidateNested()
  @Type(() => UploadFilters)
  filters: UploadFilters;
}
