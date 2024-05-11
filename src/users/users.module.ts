import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { ValidationService } from 'src/validation/validation.service';
import { UsersRepository } from './users.repository';
import { notificationsMicroserviceProvider } from 'src/notifications/microservice.provider';

@Module({
  imports: [notificationsMicroserviceProvider(), ConfigModule],
  providers: [ValidationService, UsersRepository, UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
