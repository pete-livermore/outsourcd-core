import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('users_jobs').execute();
  await database.schema
    .createTable('job_applications')
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').notNull(),
    )
    .addColumn('job_id', 'integer', (col) =>
      col.references('jobs.id').notNull(),
    )
    .addColumn('cover_letter', 'text')
    .addColumn('min_salary_expectation', 'integer', (col) => col.notNull())
    .addColumn('status', 'text', (col) =>
      col.notNull().check(sql`status IN ('accepted', 'rejected', 'pending')`),
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('user_job_id', ['user_id', 'job_id'])
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('job_applications').execute();
}
