import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { Database } from 'src/infrastructure/database/database';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwt: string;
  let databaseConnection: DatabaseModule;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    databaseConnection = app.get(Database);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test_user@manageable.works', password: 'manageable' })
      .expect(200);

    jwt = loginResponse.body.token;
  });

  afterEach(async () => {
    await databaseConnection.destroy();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200)
      .expect('Hello World!');
  });
});
