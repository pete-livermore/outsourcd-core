import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'kysely';
import { UnsanitizedCustomer, Customer } from './customer.model';
import { CustomersRepository } from './customers.repository';
import { ValidationService } from 'src/app/validation/validation.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FindCustomersParamsDto } from './dto/find-customer-params.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PopulateCustomerDto } from './dto/populate-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly customersRepository: CustomersRepository,
  ) {}

  async create(customer: CreateCustomerDto): Promise<Customer> {
    await this.validationService.validateDto(Customer, CreateCustomerDto);

    const hashedPassword = await bcrypt.hash(
      customer.password,
      this.configService.get('PASSWORD_SALT_ROUNDS'),
    );

    return this.customersRepository.create({
      ...customer,
      password: hashedPassword,
    });
  }

  async getAll(params?: FindCustomersParamsDto) {
    await this.validationService.validateDto(params, FindCustomersParamsDto);

    return this.customersRepository.getAll(params);
  }

  async findById(
    customerId: number,
    populate?: PopulateCustomerDto,
  ): Promise<Customer | undefined> {
    const customer = await this.customersRepository.findById(
      customerId,
      populate,
    );

    if (!customer) {
      throw new NotFoundException();
    }

    return customer;
  }

  async findByEmail(
    email: string,
    populate?: PopulateCustomerDto,
  ): Promise<UnsanitizedCustomer | undefined> {
    const customer = await this.customersRepository.findByEmail(
      email,
      populate,
    );

    if (!customer) {
      throw new NotFoundException();
    }

    return customer;
  }

  async update(customerId: number, customerUpdate: UpdateCustomerDto) {
    await this.validationService.validateDto(customerUpdate, UpdateCustomerDto);

    const Customer = await this.customersRepository.update(
      customerId,
      customerUpdate,
    );

    if (!Customer) {
      throw new NotFoundException();
    }

    return Customer;
  }

  delete(customerId: number): Promise<DeleteResult> {
    return this.customersRepository.delete(customerId);
  }
}
