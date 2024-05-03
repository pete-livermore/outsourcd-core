import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('companies')
    .addColumn('logo_image', 'integer', (col) => col.references('companies.id'))
    .execute();

  await database.schema
    .alterTable('jobs')
    .addColumn('location_type', 'text', (col) =>
      col
        .notNull()
        .check(sql`location_type IN ('remote', 'hybrid', 'on-site')`),
    )
    .addColumn('salary_min_value', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('salary_max_value', 'numeric(10, 2)', (col) => col.notNull())
    .dropColumn('salary_value')
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('companies')
    .dropColumn('logo_image')
    .execute();

  await database.schema
    .alterTable('jobs')
    .dropColumn('location_type')
    .dropColumn('salary_min_value')
    .dropColumn('salary_max_value')
    .addColumn('salary_value', 'numeric(10, 2)', (col) => col.notNull())
    .execute();
}
