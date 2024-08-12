import { Database } from '../database';

export async function dropDatabase(database: Database) {
  await database.schema.dropTable('job_applications').cascade().execute();
  await database.schema.dropTable('roles_permissions').cascade().execute();
  await database.schema.dropTable('roles').cascade().execute();
  await database.schema.dropTable('permissions').cascade().execute();
  await database.schema.dropTable('files').cascade().execute();
  await database.schema.dropTable('users_skills').cascade().execute();
  await database.schema.dropTable('users').cascade().execute();
  await database.schema.dropTable('sectors').cascade().execute();
  await database.schema.dropTable('companies').cascade().execute();
  await database.schema.dropTable('skills').cascade().execute();
  await database.schema.dropTable('jobs').cascade().execute();
  await database.schema.dropTable('jobs_skills').cascade().execute();
  await database.schema.dropTable('kysely_migration').cascade().execute();
  await database.schema.dropTable('kysely_migration_lock').cascade().execute();
}
