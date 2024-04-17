import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('customers_orders')
    .addColumn('customer_id', 'integer', (col) =>
      col.references('customers.id'),
    )
    .addColumn('order_id', 'integer', (col) => col.references('orders.id'))
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('customers_orders').execute();
}
