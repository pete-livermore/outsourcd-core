import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RequirePermissions } from 'src/roles-permissions/permissions.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';
import { FindOneParams } from 'src/common/dto/req-params';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PopulateParams } from 'src/common/dto/populate-params';
import { FilterParams } from 'src/common/dto/filter-params';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { Page, PageMetaDto } from 'src/common/dto/page.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @RequirePermissions(3)
  async getAll(
    @Query() { filters }: FilterParams = {},
    @Query() { populate }: PopulateParams = {},
    @Query() { limit, offset }: PaginationParams,
  ) {
    const { customers, count } = await this.customersService.getAll({
      populate,
      pagination: { limit, offset },
      filters,
    });

    return new Page(
      customers,
      new PageMetaDto({ pageOptionsDto: { limit, offset }, itemCount: count }),
    );
  }

  @Get(':id')
  async findById(@Param() { id }: FindOneParams) {
    const customer = await this.customersService.findById(id);

    return { data: customer };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateCustomerDto) {
    const customer = await this.customersService.create(data);

    return { data: customer };
  }

  @Put(':id')
  async put(
    @Param() params: { id: number },
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(params.id, updateCustomerDto);
  }
}
