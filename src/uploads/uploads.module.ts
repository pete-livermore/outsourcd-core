import { Module } from '@nestjs/common';

import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { FilesRepository } from './files.repository';
import { ConfigModule } from '@nestjs/config';
import { FileValidationService } from './file-validation.service';
import { FilesService } from './files.service';
import { CloudinaryConfigProvider } from './cloudinary-config.provider';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [
    FilesRepository,
    FileValidationService,
    FilesService,
    CloudinaryConfigProvider,
    UploadsService,
  ],
  exports: [],
})
export class UploadsModule {}
