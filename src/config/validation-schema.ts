import * as Joi from 'joi';

interface EnvVars {
  API_VERSION: number;
  APP_PORT: number;
  CACHE_TTL: number;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: number;
  CLOUDINARY_API_SECRET: string;
  JWT_SECRET: string;
  JWT_EXPIRY: number;
  MAX_UPLOAD_FILE_SIZE: number;
  NODE_ENV: 'development' | 'production' | 'test' | 'provision';
  OPEN_API_TITLE: string;
  OPEN_API_DESCRIPTION: string;
  PASSWORD_SALT_ROUNDS: number;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  REDIS_HOST: string;
  REDIS_CACHE_PORT: number;
  REDIS_QUEUE_PORT: number;
  // SENDGRID_API_KEY: string;
}

export const envValidationSchema = Joi.object<EnvVars>({
  API_VERSION: Joi.number(),
  APP_PORT: Joi.number().default(3333),
  CACHE_TTL: Joi.number().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.number().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.number().required(),
  MAX_UPLOAD_FILE_SIZE: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  OPEN_API_DESCRIPTION: Joi.string().required(),
  OPEN_API_TITLE: Joi.string().required(),
  PASSWORD_SALT_ROUNDS: Joi.number().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_CACHE_PORT: Joi.number().required(),
  REDIS_QUEUE_PORT: Joi.number().required(),
  // SENDGRID_API_KEY: Joi.string().required(),
});
