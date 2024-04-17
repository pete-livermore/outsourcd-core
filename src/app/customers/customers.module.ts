import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { ConfigModule } from '@nestjs/config';
import { ValidationService } from 'src/app/validation/validation.service';
import { CustomersRepository } from './customers.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    ValidationService,
    CustomersRepository,
    CustomersService,
    CustomersResolver,
  ],
  controllers: [CustomersController],
  exports: [CustomersService],
})
export class CustomersModule {}
