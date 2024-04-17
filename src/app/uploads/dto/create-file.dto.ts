import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { UploadProvider } from '../constants/upload-provider';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  mime: string;

  @IsString()
  @IsNotEmpty()
  ext: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  provider: UploadProvider;

  @IsJSON()
  providerMetadata: {
    public_id: string;
    resource_type: string;
  };
}
