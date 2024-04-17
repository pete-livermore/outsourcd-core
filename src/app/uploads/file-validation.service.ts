import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ALLOWED_FILE_TYPES } from './constants/allowed-file-types';
import {
  INVALID_TYPE_EXCEPTION_MESSAGE,
  MAX_SIZE_EXCEPTION_MESSAGE,
} from './constants/exception-messages';

@Injectable()
export class FileValidationService {
  constructor(private readonly configService: ConfigService) {}

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private getIsValidSize(fileSize: number, maxAllowedSize: number): boolean {
    return fileSize < maxAllowedSize;
  }

  private getIsValidType(originalFileName: string): boolean {
    return ALLOWED_FILE_TYPES.includes(this.getFileExtension(originalFileName));
  }

  async validate(file: Express.Multer.File) {
    const maxUploadFileSize = this.configService.get<number>(
      'MAX_UPLOAD_FILE_SIZE',
    );
    const isValidSize = this.getIsValidSize(file.size, maxUploadFileSize);

    if (!isValidSize) {
      throw new BadRequestException(MAX_SIZE_EXCEPTION_MESSAGE);
    }

    const isValidType = this.getIsValidType(file.originalname);

    if (!isValidType) {
      throw new BadRequestException(INVALID_TYPE_EXCEPTION_MESSAGE);
    }

    return Promise.resolve(file);
  }
}
