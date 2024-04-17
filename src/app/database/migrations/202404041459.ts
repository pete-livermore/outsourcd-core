import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('orders')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('customer_id', 'integer', (col) =>
      col.references('customers.id'),
    )
    .addColumn('fulfillment_ref', 'text')
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('orders').execute();
}
