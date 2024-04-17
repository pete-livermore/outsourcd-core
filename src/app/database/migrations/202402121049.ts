import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('customers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('is_confirmed', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('address', 'text')
    .addColumn('city', 'text')
    .addColumn('postcode', 'text')
    .addColumn('country', 'varchar(2)')
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('customers').execute();
}
