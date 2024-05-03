import { Database, Tables } from '../database/database';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { ExpressionBuilder } from 'kysely';
import { Companies } from 'src/kysely-types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './company.model';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PopulateCompanyDto } from './dto/populate-company.dto';
import { FindCompaniesParamsDto } from './dto/find-companies-params.dto';

type JobTableExpression = ExpressionBuilder<
  Tables & {
    c: Companies;
  },
  'c'
>;

@Injectable()
export class CompaniesRepository {
  constructor(private readonly db: Database) {}

  private withLogo(eb: JobTableExpression) {
    return jsonObjectFrom(
      eb
        .selectFrom('files as f')
        .select(['f.id', 'f.url'])
        .whereRef('c.logo_image', '=', 'c.id'),
    ).as('logo');
  }

  private withSector(eb: JobTableExpression) {
    return jsonObjectFrom(
      eb
        .selectFrom('sectors as s')
        .select(['s.id', 's.name'])
        .whereRef('c.sector_id', '=', 's.id'),
    ).as('sector');
  }

  async create(data: CreateCompanyDto): Promise<Company> {
    const dbResponse = await this.db
      .insertInto('companies')
      .values({
        name: data.name,
        sector_id: data.sector,
        description: data.description,
      })
      .returning(['id', 'name', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    return new Company(dbResponse);
  }

  async findById(
    companyId: number,
    populate?: PopulateCompanyDto,
  ): Promise<Company | undefined> {
    const query = this.db
      .selectFrom('companies as c')
      .where('c.id', '=', companyId)
      .select([
        'c.id',
        'c.name',
        'c.description',
        'c.created_at',
        'c.updated_at',
      ])
      .$if(populate?.logo, (qb) => qb.select((eb) => this.withLogo(eb)))
      .$if(populate?.sector, (qb) => qb.select((eb) => this.withSector(eb)));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new Company(dbResponse);
    }
  }

  async getAll({ filters, populate, pagination }: FindCompaniesParamsDto) {
    const { data, count } = await this.db.transaction().execute(async (trx) => {
      let companiesQuery = trx
        .selectFrom('companies as c')
        .select([
          'c.id',
          'c.name',
          'c.description',
          'c.created_at',
          'c.updated_at',
        ])
        .$if(populate?.logo, (qb) => qb.select((eb) => this.withLogo(eb)))
        .$if(populate?.sector, (qb) => qb.select((eb) => this.withSector(eb)))
        .orderBy('id')
        .offset(pagination.offset)
        .limit(pagination.limit);

      if (pagination.limit !== null) {
        companiesQuery = companiesQuery.limit(pagination.limit);
      }

      if (filters) {
        const { sector } = filters;

        if (sector) {
          companiesQuery = companiesQuery
            .innerJoin('sectors as s', 's.id', 'c.sector_id')
            .where('s.id', '=', sector);
        }
      }

      const jobsResponse = await companiesQuery.execute();

      const { count } = await trx
        .selectFrom('companies')
        .select((eb) => eb.fn.countAll<string>().as('count'))
        .executeTakeFirst();

      return {
        data: jobsResponse,
        count: parseInt(count),
      };
    });

    const jobs = data.map((jobData) => new Company(jobData));

    return { jobs, count };
  }

  async update(companyId: number, data: UpdateCompanyDto) {
    const dbResponse = await this.db
      .updateTable('companies as c')
      .set({
        name: data.name,
        description: data.description,
        updated_at: new Date(),
      })
      .where('c.id', '=', companyId)
      .returning([
        'c.id',
        'c.name',
        'c.description',
        'c.created_at',
        'c.updated_at',
      ])
      .executeTakeFirst();

    if (dbResponse) {
      return new Company(dbResponse);
    }
  }

  delete(companyId: number) {
    return this.db
      .deleteFrom('jobs as j')
      .where('j.id', '=', companyId)
      .executeTakeFirst();
  }
}
