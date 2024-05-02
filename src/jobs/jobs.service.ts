import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsRepository } from './jobs.repository';
import { FindJobsParamsDto } from './dto/find-jobs-params.dto';
import { ValidationService } from 'src/validation/validation.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly validationService: ValidationService,
  ) {}

  async create(job: CreateJobDto) {
    await this.validationService.validateDto(job, CreateJobDto);
    return this.jobsRepository.create(job);
  }

  async findById(jobId: number) {
    const job = await this.jobsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException();
    }

    return job;
  }

  async getAll(params?: FindJobsParamsDto) {
    await this.validationService.validateDto(params, FindJobsParamsDto);
    return this.jobsRepository.getAll(params);
  }

  async update(jobId: number, jobUpdate: UpdateJobDto) {
    await this.validationService.validateDto(jobUpdate, UpdateJobDto);

    const job = await this.jobsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException();
    }

    return await this.jobsRepository.update(jobId, jobUpdate);
  }
}
