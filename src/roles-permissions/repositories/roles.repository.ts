import { Database } from 'src/database/database';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../models/role.model';
import { PopulateRoleDto } from '../dto/find-roles-params.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  constructor(private readonly db: Database) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const dbResponse = await this.db
      .insertInto('roles')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Role(dbResponse);
  }

  async findById(roleId: number, populate?: PopulateRoleDto) {
    let query = this.db
      .selectFrom('roles as r')
      .where('r.id', '=', roleId)
      .selectAll();

    if (populate) {
      query = query
        .leftJoin('roles_permissions as rp', 'rp.role_id', 'r.id')
        .leftJoin('permissions as p', 'p.id', 'rp.permission_id')
        .select((eb) => eb.fn.agg('array_agg', ['p.id']).as('permissions'))
        .groupBy([
          'r.id',
          'r.created_at',
          'r.name',
          'r.updated_at',
          'rp.role_id',
          'rp.permission_id',
          'rp.created_at',
          'rp.updated_at',
          'p.id',
        ]);
    }

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new Role(dbResponse);
    }
  }

  async getAll() {
    const dbResponse = await this.db
      .selectFrom('roles as r')
      .selectAll()
      .execute();

    const roles = dbResponse.map((entity) => new Role(entity));

    const { count } = await this.db
      .selectFrom('roles')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .executeTakeFirst();

    return { roles, count };
  }
}
