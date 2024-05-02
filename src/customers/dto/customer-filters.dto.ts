import { Expose } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';

export class CustomerFiltersDto {
  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}
