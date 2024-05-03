import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilterParams } from 'src/common/dto/filter-params';
import { Page, PageMetaDto } from 'src/common/dto/page.dto';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { PopulateParams } from 'src/common/dto/populate-params';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async getAll(
    @Query() { filters }: FilterParams = {},
    @Query() { populate }: PopulateParams = {},
    @Query() { limit, offset }: PaginationParams,
  ) {
    const { jobs, count } = await this.companiesService.getAll({
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
    const company = await this.companiesService.findById(id);

    return { data: company };
  }
}
