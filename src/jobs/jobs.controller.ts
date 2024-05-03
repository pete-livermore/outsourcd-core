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
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.jobsService.findById(id);

    return { data: user };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateJobDto) {
    const user = await this.jobsService.create(data);

    return { data: user };
  }

  @Put(':id')
  async put(
    @Param() params: { id: number },
    @Body() updateUserDto: UpdateJobDto,
  ) {
    return this.jobsService.update(params.id, updateUserDto);
  }
}
