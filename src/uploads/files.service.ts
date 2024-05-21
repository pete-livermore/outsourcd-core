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

  findById(fileId: number) {
    return this.filesRepository.findById(fileId);
  }

  delete(fileId: number) {
    return this.filesRepository.delete(fileId);
  }
}
