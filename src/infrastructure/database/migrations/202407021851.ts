import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('jobs')
    .addColumn('employment_type', 'text', (col) =>
      col
        .notNull()
        .check(
          sql`employment_type IN ('contract', 'temporary', 'casual', 'permanent')`,
        ),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('jobs')
    .dropColumn('employment_type')
    .execute();
}
