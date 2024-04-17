import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RolesRepository } from '../repositories/roles.repository';
import { PopulateRoleDto } from '../dto/find-roles-params.dto';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  create(createRoleDto: CreateRoleDto) {
    this.rolesRepository.create(createRoleDto);
  }

  async getAll() {
    return this.rolesRepository.getAll();
  }

  findById(id: number, populate?: PopulateRoleDto) {
    return this.rolesRepository.findById(id, populate);
  }
}
