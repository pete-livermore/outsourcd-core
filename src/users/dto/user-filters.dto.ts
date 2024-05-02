import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsInt, IsOptional } from 'class-validator';

export class UserFiltersDto {
  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  role?: number;
}
