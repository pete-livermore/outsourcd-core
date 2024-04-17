import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(private readonly filesRepository: FilesRepository) {}

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  create(createFileDto: CreateFileDto) {
    return this.filesRepository.create(createFileDto);
  }
}
