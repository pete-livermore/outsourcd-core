import { ConfigService } from '@nestjs/config';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  FileValidator,
} from '@nestjs/common';

export const createFileValidators = (
  configService: ConfigService,
): FileValidator[] => {
  const maxUploadSize = configService.get<string>('MAX_UPLOAD_FILE_SIZE');

  return [
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    new MaxFileSizeValidator({
      maxSize: parseInt(maxUploadSize || '10485760'),
    }),
  ];
};
