import { Injectable, Logger } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  private readonly Logger = new Logger(FilesService.name);

  constructor(private readonly filesRepository: FilesRepository) {}

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  create(createFileDto: CreateFileDto) {
    try {
      return this.filesRepository.create(createFileDto);
    } catch (e) {
      this.Logger.error(
        `problem saving file ${createFileDto.name} to the database`,
        e,
      );
      throw e;
    }
  }

  findById(fileId: number) {
    return this.filesRepository.findById(fileId);
  }

  delete(fileId: number) {
    return this.filesRepository.delete(fileId);
  }
}
