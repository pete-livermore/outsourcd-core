import { Database } from 'src/database/database';
import { CreateFileDto } from './dto/create-file.dto';
import { FindUploadOptionsDto } from './dto/find-options.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadFile } from './models/upload-file.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesRepository {
  constructor(private readonly db: Database) {}

  async create(data: CreateFileDto): Promise<UploadFile> {
    const dbResponse = await this.db
      .insertInto('files')
      .values({
        name: data.name,
        description: data.description,
        provider: data.provider,
        provider_metadata: JSON.stringify(data.providerMetadata),
        mime: data.mime,
        ext: data.ext,
        url: data.url,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new UploadFile(dbResponse);
  }

  async findById(fileId: number): Promise<UploadFile | undefined> {
    const dbResponse = await this.db
      .selectFrom('files as f')
      .where('f.id', '=', fileId)
      .selectAll()
      .executeTakeFirst();

    if (dbResponse) {
      return new UploadFile(dbResponse);
    }
  }

  async getAll({ filters }: FindUploadOptionsDto) {
    let query = this.db.selectFrom('files as f').selectAll();

    if (filters) {
      const { mime, ext } = filters;
      if (mime) {
        query = query.where('f.mime', '=', mime);
      }

      if (ext) {
        query = query.where('f.ext', '=', ext);
      }
    }

    const dbResponse = await query.execute();
    return dbResponse.map((uploadData) => new UploadFile(uploadData));
  }

  async update(fileId: number, data: UpdateUploadDto) {
    const dbResponse = await this.db
      .updateTable('files as f')
      .set(data)
      .where('f.id', '=', fileId)
      .returningAll()
      .executeTakeFirst();

    if (dbResponse) {
      return new UploadFile(dbResponse);
    }
  }

  delete(fileId: number) {
    return this.db
      .deleteFrom('files as f')
      .where('f.id', '=', fileId)
      .executeTakeFirst();
  }
}
