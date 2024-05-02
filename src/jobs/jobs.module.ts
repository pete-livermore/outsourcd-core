import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { ValidationService } from 'src/validation/validation.service';

@Module({
  controllers: [JobsController],
  providers: [ValidationService, JobsRepository, JobsService],
})
export class JobsModule {}
