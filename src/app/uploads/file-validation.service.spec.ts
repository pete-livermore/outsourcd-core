import { Test } from '@nestjs/testing';
import { FileValidationService } from './file-validation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('File validation service', () => {
  let configService: ConfigService;
  let fileValidationService: FileValidationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [FileValidationService],
    }).compile();

    fileValidationService = module.get<FileValidationService>(
      FileValidationService,
    );
    configService = module.get<ConfigService>(ConfigService);

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'MAX_UPLOAD_FILE_SIZE') {
        return 49999;
      }
      return undefined;
    });
  });

  it('should be defined', () => {
    expect(fileValidationService).toBeDefined();
  });

  describe('validate', () => {
    it('should throw a BadRequestException if file is larger than the max allowed size', async () => {
      const testVideoFile: Express.Multer.File = {
        originalname: 'MY-video-fiLE.mpg4',
        size: 50000,
        fieldname: 'field1',
        encoding: 'utf-8',
        mimetype: 'video/mp4',
        destination: '/fake/destination',
        filename: 'fakeFilename.mp4',
        path: '/fake/path/fakeFilename.mp4',
        buffer: Buffer.from('fakeBinaryData'),
        stream: null,
      };

      const invalidFileSizeException = new BadRequestException(
        'File size exceeds maximum limit',
      );

      const fileValidationPromise =
        fileValidationService.validate(testVideoFile);

      await expect(fileValidationPromise).rejects.toThrow(
        invalidFileSizeException,
      );
    });

    it('should throw a BadRequestException if file is not of an allowed type', async () => {
      const testFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'test.tet',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'test.tet',
        path: '/tmp/test.tet',
      };

      const invalidFileTypeException = new BadRequestException(
        'Invalid file type',
      );

      const fileValidationPromise = fileValidationService.validate(testFile);

      await expect(fileValidationPromise).rejects.toThrow(
        invalidFileTypeException,
      );
    });

    it('should resolve with the file data if the file is valid', async () => {
      const testImgFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'random_Image.jpg',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'random_Image.jpg',
        path: '/tmp/random_Image.jpg',
      };

      const fileValidationPromise = fileValidationService.validate(testImgFile);

      await expect(fileValidationPromise).resolves.toMatchObject(testImgFile);
    });
  });
});
