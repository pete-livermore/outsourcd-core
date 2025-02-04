import { Database } from 'src/infrastructure/database/database';
import { JobsRepository } from './jobs.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from './models/job.model';

describe('JobsRepository', () => {
  const executeTakeFirstOrThrowMock = jest.fn();
  const executeMock = jest.fn();

  let jobsRepository: JobsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsRepository,
        {
          provide: Database,
          useValue: {
            insertInto: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            returningAll: jest.fn().mockReturnThis(),
            transaction: jest.fn().mockReturnThis(),
            execute: executeMock,
            executeTakeFirstOrThrow: executeTakeFirstOrThrowMock,
          },
        },
      ],
    }).compile();

    jobsRepository = module.get<JobsRepository>(JobsRepository);
  });

  describe('when the getAll method is called', () => {
    beforeEach(() => {
      executeMock.mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Assistant Manager',
            description: ' Etiam porttitor ligula nec vestibulum dapibus',
            salary: {
              currency: 'GBP',
              value: { min: 25000, max: 30000 },
              period: 'yr',
            },
            location_type: 'remote',
            start_date: new Date(),
            employment_type: 'permanent',
          },
          {
            id: 2,
            title: 'Software Engineer',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut accumsan leo mauris, non commodo purus condimentum id.',
            salary: {
              currency: 'GBP',
              value: { min: 400, max: 500 },
              period: 'da',
            },
            location_type: 'on-site',
            start_date: new Date(),
            employment_type: 'contract',
          },
        ],
        count: 2,
      });
    });
    describe('and the database returns valid data', () => {
      it('should return a result with a jobs property', async () => {
        const result = await jobsRepository.getAll();
        expect(result).toHaveProperty('jobs');
      });
      it('should return a count of the total items', async () => {
        const result = await jobsRepository.getAll();
        expect(result).toHaveProperty('count');
      });
      it('should return an array of JobModel instances', async () => {
        const result = await jobsRepository.getAll();
        result.jobs.every((item) => expect(item instanceof Job).toBe(true));
      });
    });
  });
});
