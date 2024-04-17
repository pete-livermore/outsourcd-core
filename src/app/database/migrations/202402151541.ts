import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable('permissions')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('action', 'text', (col) =>
      col
        .notNull()
        .check(sql`action IN ('create', 'read', 'update', 'delete')`),
    )
    .addColumn('entity', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('roles')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col)
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .createTable('roles_permissions')
    .addColumn('role_id', 'integer', (col) =>
      col.references('roles.id').notNull().onDelete('cascade'),
    )
    .addColumn('permission_id', 'integer', (col) =>
      col.references('permissions.id').notNull().onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('primary_key', ['role_id', 'permission_id'])
    .addColumn('created_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (cb) =>
      cb.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await database.schema
    .alterTable('users')
    .addColumn('role_id', 'integer', (col) => col.references('roles.id'))
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable('roles_permissions').execute();
  await database.schema.dropTable('roles').execute();
  await database.schema.dropTable('permissions').execute();
  await database.schema.alterTable('users').dropColumn('role_id').execute();
}
