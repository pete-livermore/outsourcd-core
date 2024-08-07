import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { UploadsService } from './uploads.service';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileMetadataDto } from './dto/file-metadata.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { plainToInstance } from 'class-transformer';
import { DynamicParseFilePipe } from 'src/common/pipes/parse-file-pipe';

@Controller('uploads')
export class UploadsController {
  constructor(
    private uploadsService: UploadsService,
    private filesService: FilesService,
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(DynamicParseFilePipe)
    file: Express.Multer.File,
    @Body() body: FileMetadataDto,
  ) {
    const { provider, alternativeText, description, name } = body;
    const { public_id, url, resource_type } =
      await this.uploadsService.upload(file);

    const fileDataToSave = plainToInstance(CreateFileDto, {
      provider,
      providerMetadata: { public_id, resource_type },
      url,
      alternativeText,
      description,
      name,
      mime: file.mimetype,
      ext: this.filesService.getFileExtension(file.originalname),
    });

    try {
      const file = await this.filesService.create(fileDataToSave);
      return { data: file };
    } catch (e) {
      this.uploadsService.delete(public_id);
      throw e;
    }
  }

  @Get('file/:id')
  async findById(@Param() params: { id: number }) {
    return this.filesService.findById(params.id);
  }

  @Delete('file/:id')
  @HttpCode(204)
  async delete(@Param() params: { id: number }) {
    const fileToDelete = await this.filesService.findById(params.id);

    if (!fileToDelete) {
      throw new NotFoundException();
    }

    await this.filesService.delete(params.id);

    const { public_id } = fileToDelete.providerMetadata;
    await this.uploadsService.delete(public_id);
  }
}
