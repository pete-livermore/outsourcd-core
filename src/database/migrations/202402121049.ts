import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('sectors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('companies')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('sector_id', 'integer', (col) => col.references('sectors.id'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('skills')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addCheckConstraint('type', sql`type IN ('soft', 'tech')`)
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('jobs')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id'))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('coordinates', sql`GEOGRAPHY(POINT, 4326)`, (col) =>
      col.notNull(),
    )
    .addColumn('city', 'text', (col) => col.notNull())
    .addColumn('country', 'varchar(2)', (col) => col.notNull())
    .addColumn('salary_value', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('salary_currency', 'varchar(3)', (col) => col.notNull())
    .addColumn('salary_period', 'varchar(3)', (col) => col.notNull())
    .addCheckConstraint(
      'salary_period',
      sql`salary_period IN ('hr', 'da', 'we', 'mo', 'yr')`,
    )
    .addColumn('weekly_hours', 'integer', (col) => col.notNull())
    .addColumn('start_date', 'timestamp', (cb) => cb.notNull())
    .addColumn('end_date', 'timestamp', (cb) => cb.notNull())
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('jobs_skills')
    .addColumn('job_id', 'integer', (col) => col.references('jobs.id'))
    .addColumn('skill_id', 'integer', (col) => col.references('skills.id'))
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('job_id_skill_id', ['job_id', 'skill_id'])
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('sectors').execute();
  await database.schema.dropTable('companies').execute();
  await database.schema.dropTable('skills').execute();
  await database.schema.dropTable('jobs').execute();
  await database.schema.dropTable('jobs_skills').execute();
}
