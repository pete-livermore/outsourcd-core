import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('users_jobs')
    .addColumn('role', 'varchar', (col) =>
      col.check(sql`role IN ('owner', 'applicant')`).notNull(),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.alterTable('users').dropColumn('role').execute();
}
