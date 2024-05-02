import { UnsanitizedUser, User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersParamsDto } from './dto/find-users-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Database, Tables } from '../database/database';
import { ConflictException, Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { ExpressionBuilder } from 'kysely';
import { Users } from 'src/kysely-types';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { isDatabaseError } from 'src/database/error';
import { PopulateUserDto } from './dto/populate-user.dto';

type UserTableExpression = ExpressionBuilder<
  Tables & {
    u: Users;
  },
  'u'
>;

@Injectable()
export class UsersRepository {
  constructor(private readonly db: Database) {}

  private withRole(eb: UserTableExpression) {
    return jsonObjectFrom(
      eb
        .selectFrom('roles as r')
        .select(['r.id', 'r.name'])
        .whereRef('r.id', '=', 'u.role_id'),
    ).as('role');
  }

  async create(data: CreateUserDto): Promise<User> {
    try {
      const dbResponse = await this.db
        .insertInto('users')
        .values({
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
          role_id: data.role,
        })
        .returning([
          'id',
          'email',
          'first_name',
          'last_name',
          'role_id as role',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();

      return new User(dbResponse);
    } catch (e) {
      if (isDatabaseError(e) && e.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with this email already exists');
      }
      throw e;
    }
  }

  async findById(
    userId: number,
    populate?: PopulateUserDto,
  ): Promise<User | undefined> {
    const query = this.db
      .selectFrom('users as u')
      .where('u.id', '=', userId)
      .select([
        'u.id',
        'u.email',
        'u.password',
        'u.first_name',
        'u.last_name',
        'u.created_at',
        'u.updated_at',
      ])
      .$if(populate?.role, (qb) => qb.select((eb) => this.withRole(eb)));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new User(dbResponse);
    }
  }

  async findByEmail(
    email: string,
    populate?: PopulateUserDto,
  ): Promise<UnsanitizedUser | undefined> {
    const query = this.db
      .selectFrom('users as u')
      .where('u.email', '=', email)
      .select([
        'u.id',
        'u.email',
        'u.password',
        'u.first_name',
        'u.last_name',
        'u.created_at',
        'u.updated_at',
      ])
      .$if(populate?.role, (qb) => qb.select((eb) => this.withRole(eb)))
      .$if(!populate?.role, (qb) => qb.select('u.role_id as role'));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new UnsanitizedUser(dbResponse);
    }
  }

  async getAll({ filters, populate, pagination }: FindUsersParamsDto) {
    const { data, count } = await this.db.transaction().execute(async (trx) => {
      let usersQuery = trx
        .selectFrom('users as u')
        .select([
          'u.id',
          'u.email',
          'u.password',
          'u.first_name',
          'u.last_name',
          'u.created_at',
          'u.updated_at',
        ])
        .$if(populate?.role, (qb) => qb.select((eb) => this.withRole(eb)))
        .orderBy('id')
        .offset(pagination.offset)
        .limit(pagination.limit);

      if (pagination.limit !== null) {
        usersQuery = usersQuery.limit(pagination.limit);
      }
      // .$if(populate.image, (eb) =>
      //   eb
      //     .leftJoin('upload as up', 'up.id', 'us.image_id')
      //     .select(['up.id', 'up.url']),
      // );

      if (filters) {
        const { email, role } = filters;

        if (email) {
          usersQuery = usersQuery.where('u.email', '=', email);
        }

        if (role) {
          usersQuery = usersQuery.where('u.role_id', '=', role);
        }
      }

      const usersResponse = await usersQuery.execute();

      const { count } = await trx
        .selectFrom('users')
        .select((eb) => eb.fn.countAll<string>().as('count'))
        .executeTakeFirst();

      return {
        data: usersResponse,
        count: parseInt(count),
      };
    });

    const users = data.map((userData) => new User(userData));

    return { users, count };
  }

  async update(userId: number, data: UpdateUserDto) {
    const dbResponse = await this.db
      .updateTable('users as u')
      .set({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        updated_at: new Date(),
      })
      .where('u.id', '=', userId)
      .returning([
        'u.id',
        'u.email',
        'u.first_name',
        'u.last_name',
        'u.created_at',
        'u.updated_at',
        'u.role_id as role',
      ])
      .executeTakeFirst();

    if (dbResponse) {
      return new User(dbResponse);
    }
  }

  delete(userId: number) {
    return this.db
      .deleteFrom('users as u')
      .where('u.id', '=', userId)
      .executeTakeFirst();
  }
}
