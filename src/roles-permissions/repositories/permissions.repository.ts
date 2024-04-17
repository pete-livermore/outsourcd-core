import { Database } from 'src/database/database';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Permission } from '../models/permission.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly db: Database) {}

  async create(data: CreatePermissionDto): Promise<Permission> {
    const dbResponse = await this.db
      .insertInto('permissions')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Permission(dbResponse);
  }

  async findById(permissionId: number): Promise<Permission> {
    const dbResponse = await this.db
      .selectFrom('permissions as p')
      .where('id', '=', permissionId)
      .selectAll()
      .executeTakeFirst();

    if (dbResponse) {
      return new Permission(dbResponse);
    }
  }

  async getAll() {
    const dbResponse = await this.db
      .selectFrom('permissions as p')
      .selectAll()
      .execute();

    return dbResponse.map((permissionData) => new Permission(permissionData));
  }

  async update(permissionId: number, data: UpdatePermissionDto) {
    const dbResponse = await this.db
      .updateTable('permissions as p')
      .set(data)
      .where('p.id', '=', permissionId)
      .returningAll()
      .executeTakeFirst();

    if (dbResponse) {
      return new Permission(dbResponse);
    }
  }

  delete(permissionId: number) {
    return this.db
      .deleteFrom('permissions as p')
      .where('p.id', '=', permissionId)
      .executeTakeFirst();
  }
}
