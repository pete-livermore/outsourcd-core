import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Order } from '../enums/order';
import { PaginationParams } from './pagination-params';

interface PageMetaDtoParameters {
  itemCount?: number;
  pageOptionsDto: PageOptionsDto;
}

export class PageOptionsDto extends PaginationParams {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;
}

export class PageMetaDto {
  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly page: number;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.page = Math.floor(pageOptionsDto.offset / pageOptionsDto.limit) + 1;
  }
}

export class Page<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
