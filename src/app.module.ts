import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { envValidationSchema } from 'src/config/validation-schema';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { join } from 'path';
import type { RedisClientOptions } from 'redis';
import { AdminModule } from './admin/admin.module';
import { SettingsService } from './admin/services/settings.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { ValidationService } from './validation/validation.service';
import { BullModule } from '@nestjs/bull';
import { JobsModule } from './jobs/jobs.module';
import { CompaniesModule } from './companies/companies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { createDatabaseConfig } from './infrastructure/database/database-config.factory';
import { createCacheConfig } from './infrastructure/cache/cache-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDatabaseConfig,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createCacheConfig,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_QUEUE_PORT'),
        },
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UploadsModule,
    AuthModule,
    RolesPermissionsModule,
    NestjsFormDataModule,
    AdminModule,
    JobsModule,
    CompaniesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SettingsService, ValidationService],
})
export class AppModule {}
