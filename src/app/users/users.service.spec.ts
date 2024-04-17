import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { ValidationService } from 'src/app/validation/validation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserFiltersDto } from './dto/user-filters.dto';
import { PopulateUserDto } from './dto/populate-user.dto';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: async () =>
    '$2y$10$FtMJ2TEzs4pe0VSU1hu7l.4Mw4u/NFR2lZec2VTdTeK1j9obgt6fG',
}));

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validate: jest.fn(),
}));

jest.mock('class-transformer', () => ({
  ...jest.requireActual('class-transformer'),
  plainToInstance: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let validationService: ValidationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: ValidationService,
          useValue: { validateDto: jest.fn() },
        },
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        UsersService,
        { provide: AuthService, useValue: { signIn: jest.fn() } },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    configService = module.get<ConfigService>(ConfigService);
    validationService = module.get<ValidationService>(ValidationService);
  });

  it('it should be defined', () => {
    expect(usersService).toBeDefined();
  }),
    // Create method
    describe('Create method', () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        role: 3,
      };
      it("should call the repository create function and return the result when validation passes and there isn't an existing user with that email", async () => {
        jest.mocked(plainToInstance).mockReturnValue(createUserDto);
        jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

        const userFromDb = new User({
          id: 3,
          email: 'test@example.com',
          first_name: 'test',
          last_name: 'User',
          role: 2,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const createSpy = jest
          .spyOn(usersRepository, 'create')
          .mockImplementation(async () => userFromDb);

        const result = await usersService.create(createUserDto);

        expect(createSpy).toHaveBeenCalledWith({
          ...createUserDto,
          password:
            '$2y$10$FtMJ2TEzs4pe0VSU1hu7l.4Mw4u/NFR2lZec2VTdTeK1j9obgt6fG',
        });
        expect(result).toEqual(userFromDb);
      });

      it("should hash the user's plain text password before storing it", async () => {
        jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

        jest.spyOn(configService, 'get').mockImplementation((key: string) => {
          if (key === 'PASSWORD_SALT_ROUNDS') {
            return 5;
          }
          return null;
        });

        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await usersService.create(createUserDto);

        expect(hashSpy).toHaveBeenCalledWith(createUserDto.password, 5);
      });

      it('should throw when validation fails', async () => {
        jest
          .spyOn(validationService, 'validateDto')
          .mockRejectedValue(new Error('ValidationError'));

        await expect(usersService.create(createUserDto)).rejects.toThrow(Error);
      });
    });

  // Get all method
  describe('getAll method', () => {
    it('should call usersRepository.getAll with undefined when no params are passed', async () => {
      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await usersService.getAll();

      expect(jest.spyOn(usersRepository, 'getAll')).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should call usersRepository.getAll with filters when provided', async () => {
      const filters: UserFiltersDto = {
        email: 'email@email.com',
      };

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await usersService.getAll({ filters });

      expect(jest.spyOn(usersRepository, 'getAll')).toHaveBeenCalledWith({
        filters,
      });
    });

    it('should call usersRepository.getAll with populate param when provided', async () => {
      const populate: PopulateUserDto = {
        hostedProperties: true,
        image: true,
      };

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await usersService.getAll({ populate });

      expect(jest.spyOn(usersRepository, 'getAll')).toHaveBeenCalledWith({
        populate,
      });
    });

    it('should throw an HttpException when validation fails', async () => {
      jest
        .spyOn(validationService, 'validateDto')
        .mockRejectedValue(new Error('ValidationError'));

      await expect(
        usersService.getAll({ populate: { hostedProperties: true } }),
      ).rejects.toThrow(Error);
    });
  });

  // FindById method
  describe('findById', () => {
    it('should call usersRepository.findOneById when validation passes', async () => {
      const id = 1;

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      try {
        await usersService.findById(id);
      } catch (error) {
        expect(jest.spyOn(usersRepository, 'findById')).toHaveBeenCalledWith(
          id,
          undefined,
        );
      }
    });
  });
});
