import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UploadProvider } from '../constants/upload-provider';

export class FileMetadataDto {
  @IsNotEmpty()
  @IsString()
  provider: UploadProvider;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  alternativeText?: string;
}
