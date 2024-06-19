import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { ValidationService } from 'src/validation/validation.service';
import { JobApplicationsRepository } from './job-applications.repository';
import { JobApplicationsService } from './job-applications.service';

@Module({
  controllers: [JobsController],
  providers: [
    ValidationService,
    JobsRepository,
    JobsService,
    JobApplicationsRepository,
    JobApplicationsService,
  ],
})
export class JobsModule {}
