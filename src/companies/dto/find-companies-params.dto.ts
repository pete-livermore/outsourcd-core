import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PopulateCompanyDto } from './populate-company.dto';
import { Expose, Type } from 'class-transformer';
import { CompanyFiltersDto } from './company-filters.dto';
import { FindEntityParams } from 'src/common/dto/find-entity-params.dto';

export class FindCompaniesParamsDto extends FindEntityParams {
  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PopulateCompanyDto)
  populate?: PopulateCompanyDto;

  @Expose()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyFiltersDto)
  filters?: CompanyFiltersDto;
}
