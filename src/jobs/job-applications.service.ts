import { Injectable } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { JobApplicationsRepository } from './job-applications.repository';

@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly jobApplicationsRepository: JobApplicationsRepository,
    private readonly validationService: ValidationService,
  ) {}

  async create(newApplication: CreateJobApplicationDto) {
    await this.validationService.validateDto(
      newApplication,
      CreateJobApplicationDto,
    );
    console.log('new application =>', newApplication);
    return this.jobApplicationsRepository.create(newApplication);
  }
}
