import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            getAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
      controllers: [JobsController],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
