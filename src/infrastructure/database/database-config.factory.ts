import { ConfigService } from '@nestjs/config';

export function createDatabaseConfig(configService: ConfigService) {
  const prefix = configService.get('NODE_ENV') === 'test' ? 'TEST_' : '';
  const env = (name: string) => `POSTGRES_${prefix + name}`;

  return {
    host: configService.get<string>(env('HOST')),
    port: configService.get<number>(env('PORT')),
    user: configService.get<string>(env('USER')),
    password: configService.get<string>(env('PASSWORD')),
    database: configService.get<string>(env('DB')),
  };
}
