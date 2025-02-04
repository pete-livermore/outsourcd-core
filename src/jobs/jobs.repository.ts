import { Job, JobSalary } from './models/job.model';
import { CreateJobDto } from './dto/create-job.dto';
import { FindJobsParamsDto } from './dto/find-jobs-params.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Database, Tables } from '../infrastructure/database/database';
import { Injectable } from '@nestjs/common';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { Expression, ExpressionBuilder, SqlBool, sql } from 'kysely';
import { Jobs } from 'src/kysely-types';
import { PopulateJobDto } from './dto/populate-job.dto';
import { DATE_OPERATOR_MAP } from 'src/common/constants/filter-operator-map';

type JobTableExpression = ExpressionBuilder<
  Tables & {
    j: Jobs;
  },
  'j'
>;

@Injectable()
export class JobsRepository {
  constructor(private readonly db: Database) {}

  private withCompany(
    eb: JobTableExpression,
    options?: { includeImage: boolean },
  ) {
    const { includeImage } = options ?? { includeImage: false };
    return jsonObjectFrom(
      eb
        .selectFrom('companies as c')
        .$if(includeImage, (qb) =>
          qb
            .leftJoin('files', 'files.id', 'c.image_id')
            .select(['files.url as logoUrl']),
        )
        .select(['c.id', 'c.name'])
        .whereRef('j.company_id', '=', 'c.id'),
    ).as('company');
  }

  private withApplications(eb: JobTableExpression) {
    return jsonArrayFrom(
      eb
        .selectFrom('job_applications as ja')
        .select(['ja.user_id'])
        .whereRef('ja.job_id', '=', 'j.id'),
    ).as('applications');
  }

  private selectSalary() {
    return sql<JobSalary>`json_build_object(
      'currency', salary_currency, 
      'value',  json_build_object(
          'min', salary_min_value, 
          'max', salary_max_value
        ), 
      'period', salary_period)`.as('salary');
  }

  async create(data: CreateJobDto): Promise<Job> {
    const { location, salary } = data;
    const [x, y] = location.coordinates;

    const dbResponse = await this.db
      .insertInto('jobs')
      .values({
        title: data.title,
        description: data.description,
        salary_currency: data.salary.currency,
        salary_period: salary.period,
        salary_min_value: salary.value.min,
        salary_max_value: salary.value.max,
        city: location.city,
        country: location.country,
        location_type: location.type,
        coordinates: sql`ST_MakePoint(${x}, ${y})`,
        weekly_hours: data.weeklyHours,
        start_date: data.startDate,
        company_id: data.company,
      })
      .returning([
        'id',
        'title',
        'description',
        'location_type',
        'city',
        'country',
        'weekly_hours',
        'employment_type',
        'city',
        'country',
        'start_date',
        'created_at',
        'updated_at',
        this.selectSalary(),
      ])
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
        'j.start_date',
        this.selectSalary(),
        'j.location_type',
        'j.employment_type',
        'j.city',
        'j.country',
        'j.created_at',
        'j.updated_at',
      ])
      .$if(populate?.company, (qb) => qb.select((eb) => this.withCompany(eb)))
      .$if(populate?.applications, (qb) =>
        qb.select((eb) => this.withApplications(eb)),
      );

    const dbResponse = await query.executeTakeFirst();

    if (dbResponse) {
      return new Job(dbResponse);
    }
  }

  async getAll(params?: FindJobsParamsDto) {
    const { filters, populate, pagination } = params || {};
    const { data, count } = await this.db.transaction().execute(async (trx) => {
      let jobsQuery = trx
        .selectFrom('jobs as j')
        .select([
          'j.id',
          'j.title',
          'j.description',
          'j.location_type',
          'j.start_date',
          'j.city',
          'j.country',
          'j.created_at',
          'j.updated_at',
          'j.employment_type',
          this.selectSalary(),
        ])

        .$if(populate?.company, (qb) =>
          qb.select((eb) => this.withCompany(eb, { includeImage: true })),
        )
        .$if(populate?.applications, (qb) =>
          qb.select((eb) => this.withApplications(eb)),
        )
        .orderBy('id')
        .offset(pagination.offset)
        .limit(pagination.limit);

      if (pagination.limit !== null) {
        jobsQuery = jobsQuery.limit(pagination.limit);
      }

      if (filters) {
        const { employmentTypes, locationTypes, startDate, withinDistance } =
          filters;

        if (employmentTypes?.length) {
          jobsQuery = jobsQuery.where((eb) => {
            const ors: Expression<SqlBool>[] = [];

            employmentTypes.forEach((emt) =>
              ors.push(eb('j.employment_type', '=', emt)),
            );

            return eb.or(ors);
          });
        }

        if (locationTypes?.length) {
          jobsQuery = jobsQuery.where((eb) => {
            const ors: Expression<SqlBool>[] = [];

            locationTypes.forEach((emt) =>
              ors.push(eb('j.location_type', '=', emt)),
            );

            return eb.or(ors);
          });
        }

        if (startDate) {
          const operator = DATE_OPERATOR_MAP[startDate.operator];
          jobsQuery = jobsQuery.where(
            'j.start_date',
            operator,
            startDate.value,
          );
        }

        if (withinDistance) {
          const [lat, long] = withinDistance.coordinates;
          const postGis = sql<boolean>`ST_DWithin(coordinates::geography,ST_MakePoint(${lat},${long}),${withinDistance.value})`;
          jobsQuery = jobsQuery.where(postGis);
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
        'j.location_type',
        'j.employment_type',
        'j.start_date',
        'j.city',
        'j.country',
        'j.created_at',
        'j.updated_at',
        this.selectSalary(),
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
