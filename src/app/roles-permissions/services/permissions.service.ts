import { Injectable } from '@nestjs/common';

import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionsRepository } from '../repositories/permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private permissionsRepository: PermissionsRepository) {}

  findById(id: number) {
    this.permissionsRepository.findById(id);
  }

  create(createPermissionDto: CreatePermissionDto) {
    this.permissionsRepository.create(createPermissionDto);
  }
}
