import { Database, Tables } from 'src/database/database';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../models/role.model';
import { PopulateRoleDto } from '../dto/find-roles-params.dto';
import { Injectable } from '@nestjs/common';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { ExpressionBuilder } from 'kysely';
import { Roles } from 'src/kysely-types';

type RolesExpressionBuilder = ExpressionBuilder<
  Tables & {
    r: Roles;
  },
  'r'
>;

@Injectable()
export class RolesRepository {
  constructor(private readonly db: Database) {}

  private withPermissions(eb: RolesExpressionBuilder) {
    return jsonArrayFrom(
      eb
        .selectFrom('roles_permissions as rp')
        .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
        .select(['p.id', 'p.action', 'p.resource'])
        .whereRef('rp.role_id', '=', 'r.id'),
    ).as('permissions');
  }

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
      query = query.select((eb) => [this.withPermissions(eb)]);
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
