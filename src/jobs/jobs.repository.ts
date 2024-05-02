import { Job } from './Job.model';
import { CreateJobDto } from './dto/create-job.dto';
import { FindJobsParamsDto } from './dto/find-jobs-params.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Database, Tables } from '../database/database';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { ExpressionBuilder } from 'kysely';
import { Jobs } from 'src/kysely-types';
import { PopulateJobDto } from './dto/populate-Job.dto';

type JobTableExpression = ExpressionBuilder<
  Tables & {
    j: Jobs;
  },
  'j'
>;

@Injectable()
export class JobsRepository {
  constructor(private readonly db: Database) {}

  private withCompany(eb: JobTableExpression) {
    return jsonObjectFrom(
      eb
        .selectFrom('companies as c')
        .select(['c.id', 'c.name'])
        .whereRef('j.company_id', '=', 'c.id'),
    ).as('role');
  }

  async create(data: CreateJobDto): Promise<Job> {
    const dbResponse = await this.db
      .insertInto('jobs')
      .values({
        title: data.title,
        description: data.description,
      })
      .returning(['id', 'title', 'description', 'created_at', 'updated_at'])
      .executeTakeFirstOrThrow();

    return new Job(dbResponse);
  }

  async findById(
    jobId: number,
    populate?: PopulateJobDto,
  ): Promise<Job | undefined> {
    const query = this.db
      .selectFrom('jobs as j')
      .where('j.id', '=', jobId)
      .select([
        'j.id',
        'j.title',
        'j.description',
        'j.created_at',
        'j.updated_at',
      ])
      .$if(populate?.company, (qb) => qb.select((eb) => this.withCompany(eb)));

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new Job(dbResponse);
    }
  }

  async getAll({ filters, populate, pagination }: FindJobsParamsDto) {
    const { data, count } = await this.db.transaction().execute(async (trx) => {
      let jobsQuery = trx
        .selectFrom('jobs as j')
        .select([
          'j.id',
          'j.title',
          'j.description',
          'j.created_at',
          'j.updated_at',
        ])
        .$if(populate?.company, (qb) => qb.select((eb) => this.withCompany(eb)))
        .orderBy('id')
        .offset(pagination.offset)
        .limit(pagination.limit);

      if (pagination.limit !== null) {
        jobsQuery = jobsQuery.limit(pagination.limit);
      }
      // .$if(populate.image, (eb) =>
      //   eb
      //     .leftJoin('upload as up', 'up.id', 'us.image_id')
      //     .select(['up.id', 'up.url']),
      // );

      if (filters) {
        const { employmentType } = filters;

        if (employmentType) {
          if (employmentType === 'permanent') {
            jobsQuery = jobsQuery.where('j.end_date', 'is', null);
          }
        }
      }

      const jobsResponse = await jobsQuery.execute();

      const { count } = await trx
        .selectFrom('jobs')
        .select((eb) => eb.fn.countAll<string>().as('count'))
        .executeTakeFirst();

      return {
        data: jobsResponse,
        count: parseInt(count),
      };
    });

    const jobs = data.map((jobData) => new Job(jobData));

    return { jobs, count };
  }

  async update(jobId: number, data: UpdateJobDto) {
    const dbResponse = await this.db
      .updateTable('jobs as j')
      .set({
        title: data.title,
        description: data.description,
        updated_at: new Date(),
      })
      .where('j.id', '=', jobId)
      .returning([
        'j.id',
        'j.title',
        'j.description',
        'j.created_at',
        'j.updated_at',
      ])
      .executeTakeFirst();

    if (dbResponse) {
      return new Job(dbResponse);
    }
  }

  delete(jobId: number) {
    return this.db
      .deleteFrom('jobs as j')
      .where('j.id', '=', jobId)
      .executeTakeFirst();
  }
}
