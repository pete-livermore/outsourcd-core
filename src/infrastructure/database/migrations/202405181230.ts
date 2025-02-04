import { Kysely } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable('users')
    .addColumn('image_id', 'integer', (col) => col.references('files.id'))
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.alterTable('users').dropColumn('image_id').execute();
}
