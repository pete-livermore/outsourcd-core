import { Module } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';
import { PermissionsService } from './services/permissions.service';
import { RolesService } from './services/roles.service';
import { RolesRepository } from './repositories/roles.repository';
import { PermissionsRepository } from './repositories/permissions.repository';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [],
  providers: [
    RolesRepository,
    PermissionsRepository,
    PermissionsService,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  controllers: [PermissionsController, RolesController],
  exports: [],
})
export class RolesPermissionsModule {}
