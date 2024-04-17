import { Test, TestingModule } from '@nestjs/testing';

import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { FileValidationService } from './file-validation.service';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';

describe('UploadsController', () => {
  let controller: UploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        FileValidationService,
        {
          provide: UploadsService,
          useValue: {
            upload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FilesService,
          useValue: {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
      controllers: [UploadsController],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
