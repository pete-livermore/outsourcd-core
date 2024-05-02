import { Test } from '@nestjs/testing';
import { CustomersRepository } from './customers.repository';
import { Customer, CustomerModelData } from './customer.model';
import { Database } from '../database/database';
import { ConflictException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';
import { DatabaseError } from 'pg';

describe('The CustomersRepository class', () => {
  let executeTakeFirstOrThrowMock: jest.Mock;
  let createCustomerData: CreateCustomerDto;
  let customersRepository: CustomersRepository;

  beforeEach(async () => {
    createCustomerData = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@smith.com',
      password: 'strongPassword123',
      role: 1,
    };
    executeTakeFirstOrThrowMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CustomersRepository,
        {
          provide: Database,
          useValue: {
            insertInto: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(), // Mocking the returning method
            returningAll: jest.fn().mockReturnThis(),
            executeTakeFirstOrThrow: executeTakeFirstOrThrowMock,
          },
        },
      ],
    }).compile();

    customersRepository = await module.get(CustomersRepository);
  });

  describe('when the create method is called', () => {
    describe('and the database returns valid data', () => {
      let customerModelData: CustomerModelData;
      beforeEach(() => {
        customerModelData = {
          id: 1,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john@smith.com',
          address: '5 London Road',
          city: 'London',
          country: 'UK',
          postcode: 'WC1B 3JA',
          is_confirmed: false,
          created_at: new Date(),
          updated_at: new Date(),
        };
        executeTakeFirstOrThrowMock.mockResolvedValue(customerModelData);
      });

      it('should return an instance of the Customer model', async () => {
        const result = await customersRepository.create(createCustomerData);

        expect(result instanceof Customer).toBe(true);
      });
      it('should return the CustomerModel with correct properties', async () => {
        const result = await customersRepository.create(createCustomerData);

        expect(result.id).toBe(customerModelData.id);
        expect(result.email).toBe(customerModelData.email);
        expect(result.firstName).toBe(customerModelData.first_name);
        expect(result.lastName).toBe(customerModelData.last_name);
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
          (databaseError.table = 'Customers'),
          (databaseError.detail =
            'Key (email)=(john@smith.com) already exists.'),
          executeTakeFirstOrThrowMock.mockRejectedValue(databaseError);
      });
      it('should throw the BadRequestException exception', async () => {
        await expect(
          customersRepository.create(createCustomerData),
        ).rejects.toThrow(ConflictException);
      });
    });
  });
});
