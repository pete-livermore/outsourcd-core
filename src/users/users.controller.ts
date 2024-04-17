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
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FindOneParams } from 'src/common/dto/req-params';
import { UpdateUserDto } from './dto/update-user.dto';
import { PopulateParams } from 'src/common/dto/populate-params';
import { FilterParams } from 'src/common/dto/filter-params';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { Page, PageMetaDto } from 'src/common/dto/page.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(3)
  async getAll(
    @Query() { filters }: FilterParams = {},
    @Query() { populate }: PopulateParams = {},
    @Query() { limit, offset }: PaginationParams,
  ) {
    const { users, count } = await this.usersService.getAll({
      populate,
      pagination: { limit, offset },
      filters,
    });

    return new Page(
      users,
      new PageMetaDto({ pageOptionsDto: { limit, offset }, itemCount: count }),
    );
  }

  @Get(':id')
  async findById(@Param() { id }: FindOneParams) {
    const user = await this.usersService.findById(id);

    return { data: user };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.create(data);

    return { data: user };
  }

  @Put(':id')
  async put(
    @Param() params: { id: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(params.id, updateUserDto);
  }
}
