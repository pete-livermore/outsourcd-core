import { UnsanitizedCustomer, Customer } from './customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FindCustomersParamsDto } from './dto/find-customer-params.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Database, Tables } from '../database/database';
import { ConflictException, Injectable } from '@nestjs/common';
import { ExpressionBuilder } from 'kysely';
import { Customers } from 'src/kysely-types';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { isDatabaseError } from 'src/database/error';
import { PopulateCustomerDto } from './dto/populate-customer.dto';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

type CustomerTableExpression = ExpressionBuilder<
  Tables & {
    c: Customers;
  },
  'c'
>;

@Injectable()
export class CustomersRepository {
  constructor(private readonly db: Database) {}

  private withOrders(eb: CustomerTableExpression) {
    return jsonArrayFrom(
      eb
        .selectFrom('orders as o')
        .innerJoin('customers_orders as co', 'co.order_id', 'o.id')
        .select(['o.id'])
        .whereRef('customer_id', '=', 'co.customer_id'),
    ).as('orders');
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    try {
      const dbResponse = await this.db
        .insertInto('customers')
        .values({
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
        })
        .returning([
          'id',
          'first_name',
          'last_name',
          'email',
          'address',
          'city',
          'postcode',
          'country',
          'is_confirmed',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();

      return new Customer(dbResponse);
    } catch (e) {
      if (isDatabaseError(e) && e.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Customer with this email already exists');
      }
      throw e;
    }
  }

  async findById(
    CustomerId: number,
    populate?: PopulateCustomerDto,
  ): Promise<Customer | undefined> {
    const query = this.db
      .selectFrom('customers as c')
      .where('c.id', '=', CustomerId)
      .select([
        'c.id',
        'c.email',
        'c.password',
        'c.first_name',
        'c.last_name',
        'c.is_confirmed',
        'c.created_at',
        'c.updated_at',
        'c.address',
        'c.city',
        'c.postcode',
        'c.country',
      ])
      .$if(populate?.orders, (qb) => qb.select((eb) => this.withOrders(eb)));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new Customer(dbResponse);
    }
  }

  async findByEmail(
    email: string,
    populate?: PopulateCustomerDto,
  ): Promise<UnsanitizedCustomer | undefined> {
    const query = this.db
      .selectFrom('customers as c')
      .where('c.email', '=', email)
      .select([
        'c.id',
        'c.first_name',
        'c.last_name',
        'c.email',
        'c.password',
        'c.address',
        'c.city',
        'c.country',
        'c.postcode',
        'c.created_at',
        'c.updated_at',
        'c.is_confirmed',
      ])
      .$if(populate?.orders, (qb) => qb.select((eb) => this.withOrders(eb)));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new UnsanitizedCustomer(dbResponse);
    }
  }

  async getAll({ filters, populate, pagination }: FindCustomersParamsDto) {
    const { data, count } = await this.db.transaction().execute(async (trx) => {
      let customersQuery = trx
        .selectFrom('customers as c')
        .select([
          'c.id',
          'c.email',
          'c.password',
          'c.first_name',
          'c.last_name',
          'c.address',
          'c.city',
          'c.postcode',
          'c.country',
          'c.is_confirmed',
          'c.created_at',
          'c.updated_at',
        ])
        .$if(populate?.orders, (qb) => qb.select((eb) => this.withOrders(eb)))
        .orderBy('id')
        .offset(pagination.offset)
        .limit(pagination.limit);

      if (pagination.limit !== null) {
        customersQuery = customersQuery.limit(pagination.limit);
      }
      // .$if(populate.image, (eb) =>
      //   eb
      //     .leftJoin('upload as up', 'up.id', 'us.image_id')
      //     .select(['up.id', 'up.url']),
      // );

      if (filters) {
        const { email } = filters;

        if (email) {
          customersQuery = customersQuery.where('c.email', '=', email);
        }
      }

      const customersResponse = await customersQuery.execute();

      const { count } = await trx
        .selectFrom('customers')
        .select((eb) => eb.fn.countAll<string>().as('count'))
        .executeTakeFirst();

      return {
        data: customersResponse,
        count: parseInt(count),
      };
    });

    const customers = data.map((customerData) => new Customer(customerData));

    return { customers, count };
  }

  async update(CustomerId: number, data: UpdateCustomerDto) {
    const dbResponse = await this.db
      .updateTable('customers as c')
      .set({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        updated_at: new Date(),
      })
      .where('c.id', '=', CustomerId)
      .returning([
        'c.id',
        'c.email',
        'c.first_name',
        'c.last_name',
        'c.address',
        'c.city',
        'c.postcode',
        'c.country',
        'c.is_confirmed',
        'c.created_at',
        'c.updated_at',
      ])
      .executeTakeFirst();

    if (dbResponse) {
      return new Customer(dbResponse);
    }
  }

  delete(CustomerId: number) {
    return this.db
      .deleteFrom('customers as u')
      .where('u.id', '=', CustomerId)
      .executeTakeFirst();
  }
}
