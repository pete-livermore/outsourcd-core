import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersService } from '../src/users/users.service';
import { AppModule } from 'src/app.module';
import * as authenticatedUser from './fixtures/authenticated-user.json';
import * as users from './fixtures/users.json';

describe('Users', () => {
  let app: INestApplication;
  let jwt: string;
  const mockUsersService = {
    getAll: () => ({ users, count: 2 }),
    findByEmail: () => authenticatedUser,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  beforeEach(async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test_user@manageable.works', password: 'manageable' })
      .expect(200);

    jwt = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200)
      .expect({
        data: mockUsersService.getAll().users,
        meta: { limit: 25, itemCount: 2, pageCount: 1, page: 1 },
      });
  });
});
