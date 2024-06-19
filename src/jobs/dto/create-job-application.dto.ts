import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { JOB_APPLICTION_STATUSES } from '../constants/job-application-statuses';

export class CreateJobApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  jobId: number;

  @ApiProperty()
  @IsString()
  coverLetter: string;

  @ApiProperty()
  @IsNumber()
  minSalaryExpectation: number;

  @ApiProperty()
  @IsIn(JOB_APPLICTION_STATUSES)
  status: string;
}
