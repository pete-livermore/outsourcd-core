import { IsNotEmpty, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { FileMetadataDto } from './file-metadata.dto';

export class UploadFileBodyDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FileMetadataDto)
  metadata: FileMetadataDto;
}
