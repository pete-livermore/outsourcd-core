import { Test } from '@nestjs/testing';
import { FilesRepository } from './files.repository';
import { ConfigModule } from '@nestjs/config';
import { Database } from 'src/app/database/database';
import { UploadFile, UploadFileModelData } from './models/upload-file.model';
import { CreateFileDto } from './dto/create-file.dto';
import { plainToInstance } from 'class-transformer';

const executeTakeFirstOrThrowMock = jest.fn();

describe('Files repository', () => {
  let filesRepository: FilesRepository;
  let createFileData: CreateFileDto;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: Database,
          useValue: {
            insertInto: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            returningAll: jest.fn().mockReturnThis(),
            executeTakeFirstOrThrow: executeTakeFirstOrThrowMock,
          },
        },
        FilesRepository,
      ],
    }).compile();

    filesRepository = module.get<FilesRepository>(FilesRepository);

    createFileData = plainToInstance(CreateFileDto, {
      name: 'file name',
      ext: 'jpg',
      mime: 'image/jpeg',
      url: 'https://img-url.com',
      provider: 'cloudinary',
      providerMetadata: {},
    });
  });

  it('should be defined', () => {
    expect(filesRepository).toBeDefined();
  });

  describe('when the create method is called', () => {
    describe('and the database returns valid data', () => {
      let fileModelData: UploadFileModelData;
      beforeEach(() => {
        fileModelData = {
          id: 1,
          name: 'filename',
          url: 'https://file-url.com',
          created_at: new Date(),
          updated_at: new Date(),
          ext: 'jpg',
          mime: 'image/jpeg',
          description: '',
        };
        executeTakeFirstOrThrowMock.mockResolvedValue(fileModelData);
      });
      it('should return an instance of the UserModel', async () => {
        const result = await filesRepository.create(createFileData);

        expect(result).toBeInstanceOf(UploadFile);
      });
      it('should return the UserModel with correct properties', async () => {
        const result = await filesRepository.create(createFileData);

        expect(result.id).toBe(fileModelData.id);
        expect(result.name).toBe(fileModelData.name);
        expect(result.url).toBe(fileModelData.url);
      });
    });
  });
});
