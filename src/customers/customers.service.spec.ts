import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth/auth.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customer.model';
import { CustomersRepository } from './customers.repository';
import { CustomersService } from './customers.service';
import * as bcrypt from 'bcrypt';
import { ValidationService } from 'src/validation/validation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerFiltersDto } from './dto/customer-filters.dto';
import { PopulateCustomerDto } from './dto/populate-customer.dto';

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

describe('CustomersService', () => {
  let customersService: CustomersService;
  let customersRepository: CustomersRepository;
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
          provide: CustomersRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        CustomersService,
        { provide: AuthService, useValue: { signIn: jest.fn() } },
      ],
    }).compile();

    customersService = module.get<CustomersService>(CustomersService);
    customersRepository = module.get<CustomersRepository>(CustomersRepository);
    configService = module.get<ConfigService>(ConfigService);
    validationService = module.get<ValidationService>(ValidationService);
  });

  it('it should be defined', () => {
    expect(CustomersService).toBeDefined();
  }),
    // Create method
    describe('Create method', () => {
      const createCustomerDto: CreateCustomerDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'Customer',
        role: 3,
      };
      it("should call the repository create function and return the result when validation passes and there isn't an existing Customer with that email", async () => {
        jest.mocked(plainToInstance).mockReturnValue(createCustomerDto);
        jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

        const CustomerFromDb = new Customer({
          id: 3,
          email: 'test@example.com',
          first_name: 'test',
          last_name: 'Customer',
          is_confirmed: false,
          address: '',
          city: '',
          postcode: '',
          country: '',
          created_at: new Date(),
          updated_at: new Date(),
        });

        const createSpy = jest
          .spyOn(customersRepository, 'create')
          .mockImplementation(async () => CustomerFromDb);

        const result = await customersService.create(createCustomerDto);

        expect(createSpy).toHaveBeenCalledWith({
          ...createCustomerDto,
          password:
            '$2y$10$FtMJ2TEzs4pe0VSU1hu7l.4Mw4u/NFR2lZec2VTdTeK1j9obgt6fG',
        });
        expect(result).toEqual(CustomerFromDb);
      });

      it("should hash the customer's plain text password before storing it", async () => {
        jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

        jest.spyOn(configService, 'get').mockImplementation((key: string) => {
          if (key === 'PASSWORD_SALT_ROUNDS') {
            return 5;
          }
          return null;
        });

        const hashSpy = jest.spyOn(bcrypt, 'hash');

        await customersService.create(createCustomerDto);

        expect(hashSpy).toHaveBeenCalledWith(createCustomerDto.password, 5);
      });

      it('should throw when validation fails', async () => {
        jest
          .spyOn(validationService, 'validateDto')
          .mockRejectedValue(new Error('ValidationError'));

        await expect(
          customersService.create(createCustomerDto),
        ).rejects.toThrow(Error);
      });
    });

  // Get all method
  describe('getAll method', () => {
    it('should call customersRepository.getAll with undefined when no params are passed', async () => {
      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await customersService.getAll();

      expect(jest.spyOn(customersRepository, 'getAll')).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should call customersRepository.getAll with filters when provided', async () => {
      const filters: CustomerFiltersDto = {
        email: 'email@email.com',
      };

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await customersService.getAll({ filters });

      expect(jest.spyOn(customersRepository, 'getAll')).toHaveBeenCalledWith({
        filters,
      });
    });

    it('should call customersRepository.getAll with populate param when provided', async () => {
      const populate: PopulateCustomerDto = {
        orders: true,
        image: true,
      };

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      await customersService.getAll({ populate });

      expect(jest.spyOn(customersRepository, 'getAll')).toHaveBeenCalledWith({
        populate,
      });
    });

    it('should throw an HttpException when validation fails', async () => {
      jest
        .spyOn(validationService, 'validateDto')
        .mockRejectedValue(new Error('ValidationError'));

      await expect(
        customersService.getAll({ populate: { orders: true } }),
      ).rejects.toThrow(Error);
    });
  });

  // FindById method
  describe('findById', () => {
    it('should call customersRepository.findOneById when validation passes', async () => {
      const id = 1;

      jest.spyOn(validationService, 'validateDto').mockResolvedValue([]);

      try {
        await customersService.findById(id);
      } catch (error) {
        expect(
          jest.spyOn(customersRepository, 'findById'),
        ).toHaveBeenCalledWith(id, undefined);
      }
    });
  });
});
