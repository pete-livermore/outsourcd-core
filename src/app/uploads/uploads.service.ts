import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeliveryType,
  ResourceType,
  UploadApiOptions,
  v2 as cloudinary,
} from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { FileValidationService } from './file-validation.service';

interface DestroyOptions {
  resource_type?: ResourceType;
  type?: DeliveryType;
  invalidate?: boolean;
}

@Injectable()
export class UploadsService {
  constructor(private readonly fileValidationService: FileValidationService) {}

  async upload(file: Express.Multer.File, options?: UploadApiOptions) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    await this.fileValidationService.validate(file);

    const tempDir = 'temp';
    const tempFilePath =
      path.join(__dirname, '..', tempDir) + file.originalname;
    await fs.promises.writeFile(tempFilePath, file.buffer);

    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      ...options,
      folder: 'manageable_users',
    });

    await fs.promises.unlink(tempFilePath);

    return uploadResponse;
  }

  delete(publicId: string, options?: DestroyOptions) {
    return cloudinary.uploader.destroy(publicId, options);
  }

  uploadAndCreate() {}
}
