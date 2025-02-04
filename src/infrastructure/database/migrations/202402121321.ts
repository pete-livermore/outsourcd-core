import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('biography', 'text')
    .addColumn('is_confirmed', 'boolean', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('users_skills')
    .addColumn('user_id', 'integer', (col) => col.references('users.id'))
    .addColumn('skill_id', 'integer', (col) => col.references('skills.id'))
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('user_id_skill_id', ['user_id', 'skill_id'])
    .execute();

  await database.schema
    .createTable('users_jobs')
    .addColumn('user_id', 'integer', (col) => col.references('users.id'))
    .addColumn('job_id', 'integer', (col) => col.references('jobs.id'))
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('user_id_job_id', ['user_id', 'job_id'])
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('users_skills').execute();
  await database.schema.dropTable('users_jobs').execute();
  await database.schema.dropTable('users').execute();
}
