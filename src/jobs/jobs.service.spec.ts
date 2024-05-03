import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { ValidationService } from 'src/validation/validation.service';
import { JobsRepository } from './jobs.repository';

describe('JobsService', () => {
  let validationService: ValidationService;
  let jobsRepository: JobsRepository;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ValidationService,
          useValue: {
            validateDto: jest.fn(),
          },
        },
        {
          provide: JobsRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            getAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        JobsService,
      ],
    }).compile();

    validationService = module.get<ValidationService>(ValidationService);
    jobsRepository = module.get<JobsRepository>(JobsRepository);
    jobsService = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(jobsService).toBeDefined();
  });

  describe('create', () => {
    it('should call validateDto and throw an error if it fails', async () => {
      const jobToCreate = {
        title: 'Job title',
        description: 'This is a job description',
        salary: {
          value: {
            min: 20000,
            max: 25000,
          },
          currency: 'GBP',
          period: 'yr',
        },
        location_type: 'on-site',
      };
      const VALIDATION_ERROR = 'validation gone wrong';
      jest
        .spyOn(validationService, 'validateDto')
        .mockRejectedValue(new Error(VALIDATION_ERROR));

      expect(jobsService.create(jobToCreate)).rejects.toThrow(VALIDATION_ERROR);
    });

    it('should call jobsRepository.create with the DTO if validation passes', async () => {
      const jobToCreate = {
        title: 'Job title',
        description: 'This is a job description',
        salary: {
          value: {
            min: 20000,
            max: 25000,
          },
          currency: 'GBP',
          period: 'yr',
        },
        location_type: 'remote',
      };

      jest.spyOn(validationService, 'validateDto').mockResolvedValue(undefined);

      await jobsService.create(jobToCreate);

      expect(jest.spyOn(jobsRepository, 'create')).toHaveBeenCalledWith(
        jobToCreate,
      );
    });
  });
});
