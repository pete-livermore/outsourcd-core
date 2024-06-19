import { Database } from '../database/database';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { JobApplication } from './models/job-application.model';
import { isDatabaseError } from 'src/database/error';
import { PostgresErrorCode } from 'src/database/postgres-error-code.enum';

@Injectable()
export class JobApplicationsRepository {
  constructor(private readonly db: Database) {}

  async create(data: CreateJobApplicationDto): Promise<JobApplication> {
    try {
      const dbResponse = await this.db
        .insertInto('job_applications')
        .values({
          user_id: data.userId,
          job_id: data.jobId,
          min_salary_expectation: data.minSalaryExpectation,
          cover_letter: data.coverLetter,
          status: data.status,
        })
        .returning([
          'user_id',
          'job_id',
          'min_salary_expectation',
          'status',
          'cover_letter',
          'created_at',
          'updated_at',
        ])
        .executeTakeFirstOrThrow();
      return new JobApplication(dbResponse);
    } catch (e) {
      if (isDatabaseError(e)) {
        if (e.code === PostgresErrorCode.UniqueViolation) {
          throw new ConflictException(
            'Job application with this job_id and user_id already exists',
          );
        }
      }
    }
  }
}
