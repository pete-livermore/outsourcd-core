import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const fileValidators = [
  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  new MaxFileSizeValidator({
    maxSize: parseInt(process.env.MAX_UPLOAD_FILE_SIZE || '1048576'),
  }),
];
