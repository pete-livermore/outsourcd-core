import { Test, TestingModule } from '@nestjs/testing';
import { FilesRepository } from './files.repository';
import { UploadsService } from './uploads.service';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { FileValidationService } from './file-validation.service';
import * as fs from 'fs';
import { v2, UploadApiResponse } from 'cloudinary';

// TODO: Improve on expect.any to reduce flakiness

jest.mock('cloudinary', () => ({
  ...jest.requireActual('cloudinary'),
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    writeFile: jest.fn(),
    unlink: jest.fn(),
  },
}));

const validateMock = jest.fn();

describe('UploadsService', () => {
  let uploadsService: UploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: FilesRepository,
          useValue: {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: FileValidationService,
          useValue: {
            validate: validateMock,
          },
        },
        UploadsService,
      ],
    }).compile();

    uploadsService = module.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(uploadsService).toBeDefined();
  });

  describe('upload method', () => {
    it('should throw an error if no file is passed', async () => {
      const noFileException = new BadRequestException('No file provided');
      await expect(uploadsService.upload(undefined)).rejects.toThrow(
        noFileException,
      );
    });

    it('should call fileValidationService.validate with the file data', async () => {
      const testFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
      };
      validateMock.mockResolvedValue(testFile);

      await uploadsService.upload(testFile);

      expect(validateMock).toHaveBeenCalledWith(testFile);
    });

    it('should call writePath with the temporary file path and the binary data of the file', async () => {
      const testFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
      };

      validateMock.mockResolvedValue(testFile);

      await uploadsService.upload(testFile);

      expect(jest.mocked(fs.promises.writeFile)).toHaveBeenCalledWith(
        expect.any(String),
        testFile.buffer,
      );
    });

    it('should call cloudinary.uploader.upload with the temporary file path plus cloudinary options, and return the cloudinary response', async () => {
      const testFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
      };

      const cloudinaryResponse: UploadApiResponse = {
        url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample_image.png',
        secure_url:
          'https://res.cloudinary.com/demo/image/upload/v1234567890/sample_image.png',
        public_id: '',
        version: 2,
        signature: '',
        width: 1600,
        height: 900,
        format: 'jpg',
        resource_type: 'image',
        created_at: '2024-03-28T12:00:00Z',
        tag: '',
        tags: [],
        pages: 1,
        bytes: 1024,
        type: '',
        etag: '',
        placeholder: false,
        access_mode: '',
        original_filename: '',
        moderation: [''],
        access_control: [''],
        context: {},
        metadata: {},
      };

      validateMock.mockResolvedValue(testFile);

      const uploadMock = jest
        .mocked(v2.uploader.upload)
        .mockResolvedValue(cloudinaryResponse);

      const cloudinaryOptions = { image_metadata: true, overwrite: true };
      const result = await uploadsService.upload(testFile, cloudinaryOptions);

      expect(uploadMock).toHaveBeenCalledWith(expect.any(String), {
        ...cloudinaryOptions,
        folder: expect.any(String),
      });
      expect(result).toBe(cloudinaryResponse);
    });

    it('should call fs.promises.unlink with the temporary file path', async () => {
      const testFile: Express.Multer.File = {
        stream: null,
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 2048,
        buffer: Buffer.from('Mock file content'),
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
      };

      validateMock.mockResolvedValue(testFile);

      await uploadsService.upload(testFile);

      expect(jest.mocked(fs.promises.unlink)).toHaveBeenCalledWith(
        expect.any(String),
      );
    });
  });
});
