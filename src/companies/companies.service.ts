import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ValidationService } from 'src/validation/validation.service';
import { FindCompaniesParamsDto } from './dto/find-companies-params.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  async create(company: CreateCompanyDto) {
    await this.validationService.validateDto(company, CreateCompanyDto);
    return this.companiesRepository.create(company);
  }

  async findById(companyId: number) {
    const company = await this.companiesRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException();
    }

    return company;
  }

  async getAll(params?: FindCompaniesParamsDto) {
    await this.validationService.validateDto(params, FindCompaniesParamsDto);
    return this.companiesRepository.getAll(params);
  }

  async update(companyId: number, companyUpdate: UpdateCompanyDto) {
    await this.validationService.validateDto(companyUpdate, UpdateCompanyDto);

    const company = await this.companiesRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException();
    }

    return await this.companiesRepository.update(companyId, companyUpdate);
  }
}
