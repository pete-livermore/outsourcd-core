import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { User, UserModelData } from './user.model';
import { Database } from '../database/database';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { DatabaseError } from 'pg';

describe('The UsersRepository class', () => {
  const executeTakeFirstOrThrowMock = jest.fn();
  let createUserData: CreateUserDto;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    createUserData = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
      password: 'strongPassword123',
      role: 1,
      isConfirmed: false,
    };
    const module = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: Database,
          useValue: {
            insertInto: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            returningAll: jest.fn().mockReturnThis(),
            executeTakeFirstOrThrow: executeTakeFirstOrThrowMock,
          },
        },
      ],
    }).compile();

    usersRepository = await module.get(UsersRepository);
  });

  describe('when the create method is called', () => {
    describe('and the database returns valid data', () => {
      let userModelData: UserModelData;

      beforeEach(() => {
        userModelData = {
          id: 1,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@smith.com',
          biography: 'here is a biography',
          created_at: new Date(),
          updated_at: new Date(),
        };
        executeTakeFirstOrThrowMock.mockResolvedValue(userModelData);
      });

      it('should return an instance of the UserModel', async () => {
        const result = await usersRepository.create(createUserData);

        expect(result instanceof User).toBe(true);
      });
      it('should return the UserModel with correct properties', async () => {
        const result = await usersRepository.create(createUserData);

        expect(result.id).toBe(userModelData.id);
        expect(result.email).toBe(userModelData.email);
        expect(result.firstName).toBe(userModelData.first_name);
        expect(result.lastName).toBe(userModelData.last_name);
      });
    });
    describe('and the database throws the UniqueViolation', () => {
      beforeEach(() => {
        const databaseError = new DatabaseError(
          'duplicate key value violates unique constraint "unique_email',
          212,
          'error',
        );

        (databaseError.code = String(PostgresErrorCode.UniqueViolation)),
          (databaseError.table = 'users'),
          (databaseError.detail =
            'Key (email)=(john@smith.com) already exists.'),
          executeTakeFirstOrThrowMock.mockRejectedValue(databaseError);
      });
      it('should throw the BadRequestException exception', async () => {
        await expect(usersRepository.create(createUserData)).rejects.toThrow(
          ConflictException,
        );
      });
    });
  });
});
