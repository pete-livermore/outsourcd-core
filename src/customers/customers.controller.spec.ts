import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customer.model';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

describe('CustomersController', () => {
  let customersController: CustomersController;
  let customersService: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    customersController = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(CustomersController).toBeDefined();
  });

  // Get all handler
  describe('getAll', () => {
    it('should return an array of Customers', async () => {
      const result: Customer[] = [
        {
          id: 1,
          firstName: 'name',
          lastName: 'surname',
          email: 'email@email.com',
          address: '',
          city: '',
          country: '',
          postcode: '',
          isConfirmed: false,
          createdAt: new Date('2024-06-14 13:36:58.171'),
          updatedAt: new Date('2024-06-14 13:36:58.171'),
        },
      ];
      jest
        .spyOn(customersService, 'getAll')
        .mockImplementation(async () => ({ customers: result, count: 1 }));

      expect(
        await customersController.getAll(
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
    it('should return a Customer from CustomerService', async () => {
      const returnedCustomer: Customer = {
        id: 42,
        firstName: 'Test',
        lastName: 'Customer',
        email: 'email@email.com',
        address: '',
        city: '',
        country: '',
        postcode: '',
        isConfirmed: true,
        createdAt: new Date('2024-06-14 13:36:58.171'),
        updatedAt: new Date('2024-06-14 13:36:58.171'),
      };

      jest
        .spyOn(customersService, 'findById')
        .mockResolvedValue(returnedCustomer);

      const result = await customersController.findById({
        id: 42,
      });

      expect(result).toEqual({
        data: returnedCustomer,
      });
    });
  });

  describe('Create Customer handler', () => {
    it('should create a new Customer and return 204 status code', async () => {
      const createCustomerDto: CreateCustomerDto = {
        email: 'random_test_email57@email.com',
        password: 'R@nd0MPassword.5',
        firstName: 'Miranda',
        lastName: 'Anas',
        role: 3,
      };

      const createdCustomer = new Customer({
        id: 7,
        email: 'random_test_email57@email.com',
        is_confirmed: false,
        first_name: 'Miranda',
        last_name: 'Anas',
        address: '',
        city: '',
        country: '',
        postcode: '',
        created_at: new Date(),
        updated_at: new Date(),
      });

      jest.spyOn(customersService, 'create').mockResolvedValue(createdCustomer);

      const result = await customersController.create(createCustomerDto);

      expect(customersService.create).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual({ data: createdCustomer });
    });
  });
});
