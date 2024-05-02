import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PopulateUserDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  hostedProperties?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  image?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  role?: boolean;
}
