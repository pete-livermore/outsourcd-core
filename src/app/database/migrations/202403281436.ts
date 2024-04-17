import { Kysely } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('files')
    .addColumn('provider', 'varchar', (col) => col.notNull())
    .addColumn('provider_metadata', 'jsonb', (col) => col.notNull())
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('files')
    .dropColumn('provider')
    .dropColumn('provider_metadata')
    .execute();
}
