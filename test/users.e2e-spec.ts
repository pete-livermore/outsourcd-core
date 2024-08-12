import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import * as users from './fixtures/users.json';
import * as roles from './fixtures/roles.json';
import * as permissions from './fixtures/permissions.json';
import * as rolesPermissions from './fixtures/roles-permissions.json';
import { Database } from 'src/database/database';
import { migrateToLatest } from 'src/run-migrations';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'src/database/utils/drop-database';

async function seedData(database: Database) {
  await database.insertInto('permissions').values(permissions).execute();
  await database.insertInto('roles').values(roles).execute();
  await database
    .insertInto('roles_permissions')
    .values(rolesPermissions)
    .execute();
  await database.insertInto('users').values(users).execute();
}

describe('Users', () => {
  let app: INestApplication;
  let jwt: string;
  let configService: ConfigService;
  let database: Database;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();

    configService = moduleRef.get<ConfigService>(ConfigService);
    database = moduleRef.get<Database>(Database);

    await migrateToLatest(configService);
    await seedData(database);
  }, 15000);

  beforeEach(async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test_user@email.com', password: 'manageable' })
      .expect(200);

    jwt = loginResponse.body.token;
  });

  afterAll(async () => {
    await dropDatabase(database);
    database.destroy();
    await app.close();
  });

  it(`/GET users`, async () => {
    const expectedUsers = [
      {
        id: 32,
        firstName: 'Test',
        lastName: 'User',
        email: 'test_user@email.com',
        biography: null,
      },
      {
        id: 500,
        firstName: 'Test',
        lastName: 'User2',
        email: 'test_user_2@email.com',
        biography: null,
      },
    ];

    const expectedMeta = { limit: 25, itemCount: 2, pageCount: 1, page: 1 };

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200);

    const returnedUsers = response.body.data;

    expectedUsers.forEach((expectedUser, i) => {
      const actualUser = returnedUsers[i];

      expect(actualUser).toEqual(expect.objectContaining(expectedUser));
      expect(new Date(actualUser.createdAt).toISOString()).toBe(
        actualUser.createdAt,
      );
      expect(new Date(actualUser.updatedAt).toISOString()).toBe(
        actualUser.updatedAt,
      );
    });

    expect(response.body.meta).toEqual(expectedMeta);
  });
});
