import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  // Get all handler
  describe('getAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          firstName: 'name',
          lastName: 'surname',
          email: 'email@email.com',
          biography: '',
          role: 2,
          createdAt: new Date('2024-06-14 13:36:58.171'),
          updatedAt: new Date('2024-06-14 13:36:58.171'),
        },
      ];
      jest
        .spyOn(usersService, 'getAll')
        .mockImplementation(async () => ({ users: result, count: 1 }));

      expect(
        await usersController.getAll(
          { filters: { role: 2 } },
          { populate: { image: true } },
          { limit: 25, offset: 0 },
        ),
      ).toEqual({
        data: result,
        meta: { itemCount: 1, limit: 25, pageCount: 1, page: 1 },
      });
    });
  });

  describe('findById handler', () => {
    it('should return a user from userService', async () => {
      const returnedUser: User = {
        id: 42,
        firstName: 'Test',
        lastName: 'User',
        email: 'email@email.com',
        biography: 'here is a biography',
        role: 2,
        createdAt: new Date('2024-06-14 13:36:58.171'),
        updatedAt: new Date('2024-06-14 13:36:58.171'),
      };

      jest.spyOn(usersService, 'findById').mockResolvedValue(returnedUser);

      const result = await usersController.findById(42);

      expect(result).toEqual({
        data: returnedUser,
      });
    });
  });

  describe('Create user handler', () => {
    it('should create a new user and return 204 status code', async () => {
      const createUserDto: CreateUserDto = {
        email: 'random_test_email57@email.com',
        password: 'R@nd0MPassword.5',
        firstName: 'Miranda',
        lastName: 'Anas',
        role: 3,
        isConfirmed: false,
      };

      const createdUser = new User({
        id: 7,
        email: 'random_test_email57@email.com',
        first_name: 'Miranda',
        last_name: 'Anas',
        role: 3,
        biography: '',
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ data: createdUser });
    });
  });
});
