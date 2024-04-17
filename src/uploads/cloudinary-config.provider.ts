import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants/cloudinary';

export const CloudinaryConfigProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: String(configService.get<number>('CLOUDINARY_API_KEY')),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
};
