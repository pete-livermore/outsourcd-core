import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { RequirePermissions } from 'src/roles-permissions/decorators/permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PopulateParams } from 'src/common/dto/populate-params';
import { FilterParams } from 'src/common/dto/filter-params';
import { PaginationParams } from 'src/common/dto/pagination-params';
import { Page, PageMetaDto } from 'src/common/dto/page.dto';
import { Request } from 'src/common/interfaces/request';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { RESOURCE_NAME } from './constants/resource-name';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions({ action: 'read', resource: RESOURCE_NAME })
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

  @Get('me')
  async findAuthenticatedUser(@Req() request: Request) {
    const { id } = request.user;
    const data = await this.usersService.findById(id, {
      role: true,
      image: true,
    });
    return { data };
  }

  @Get(':id')
  @RequirePermissions({ action: 'read', resource: RESOURCE_NAME })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);

    return { data: user };
  }

  @Post()
  @RequirePermissions({ action: 'create', resource: RESOURCE_NAME })
  @HttpCode(201)
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.create(data);

    return { data: user };
  }

  @Put(':id')
  @RequirePermissions({ action: 'update', resource: RESOURCE_NAME })
  async put(
    @Param() params: { id: number },
    @Body() replaceUserDto: ReplaceUserDto,
  ) {
    return this.usersService.update(params.id, replaceUserDto);
  }

  @Patch(':id')
  @RequirePermissions({ action: 'update', resource: RESOURCE_NAME })
  async patch(
    @Param() params: { id: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(params.id, updateUserDto);
  }
}
