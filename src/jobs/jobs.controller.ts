import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Page, PageMetaDto } from 'src/common/dto/page.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FilterParams } from 'src/common/dto/filter-params';
import { PopulateParams } from 'src/common/dto/populate-params';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { AddApplicantDto } from './dto/add-applicant-dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getAll(
    @Query() { filters }: FilterParams = {},
    @Query() { populate }: PopulateParams = {},
    @Query() { limit, offset }: PaginationParams,
  ) {
    const { jobs, count } = await this.jobsService.getAll({
      populate,
      pagination: { limit, offset },
      filters,
    });

    return new Page(
      jobs,
      new PageMetaDto({ pageOptionsDto: { limit, offset }, itemCount: count }),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Query() { populate }: PopulateParams = {},
  ) {
    const job = await this.jobsService.findById(id, populate);

    return { data: job };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateJobDto) {
    const job = await this.jobsService.create(data);

    return { data: job };
  }

  @Put(':id')
  async put(
    @Param() params: { id: number },
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(params.id, updateJobDto);
  }

  @Post(':id/applicants')
  async addApplicant(
    @Param('id') jobId: number,
    @Body() { userId }: AddApplicantDto,
  ) {
    await this.jobsService.addApplicant(jobId, userId);
    return { message: 'Applicant added successfully' };
  }
}
