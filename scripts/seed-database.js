const { Kysely, PostgresDialect, sql } = require('kysely');
const { Pool } = require('pg');
const users = require('../src/users/seeds/users.json');
const sectors = require('../src/companies/seeds/sectors.json');
const companies = require('../src/companies/seeds/companies.json');
const jobs = require('../src/jobs/seeds/jobs.json');
require('dotenv').config();

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    }),
  }),
});

async function seed() {
  await db.transaction().execute(async (trx) => {
    await trx.insertInto('users').values(users).execute();
    await trx.insertInto('sectors').values(sectors).execute();
    await trx.insertInto('companies').values(companies).execute();

    const jobsWithLocation = jobs.map((job) => ({
      ...job,
      coordinates: sql`ST_MakePoint(${job.coordinates[0]}, ${job.coordinates[1]})`,
    }));
    await trx.insertInto('jobs').values(jobsWithLocation).execute();
  });
}

seed()
  .then(() => {
    console.log('Database successfully seeded');
    db.destroy();
  })
  .catch((err) => console.error(err));
