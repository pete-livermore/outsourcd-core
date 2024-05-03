import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { ValidationService } from 'src/validation/validation.service';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [ValidationService, CompaniesRepository, CompaniesService],
})
export class CompaniesModule {}
