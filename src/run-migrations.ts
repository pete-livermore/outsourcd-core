import * as path from 'path';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Database } from './infrastructure/database/database';
import { createDatabase } from './infrastructure/database/database-config.factory';

config();

export async function migrateToLatest(configService: ConfigService) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(createDatabase(configService)),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'database/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

const configService = new ConfigService();
migrateToLatest(configService);
