import { ApiProperty } from '@nestjs/swagger';

interface PopulatedRole {
  id: number;
  name: string;
}

export interface UserModelData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: number | PopulatedRole;
  created_at: Date;
  updated_at: Date;
}

export class User {
  id: number;
  firstName: string;
  lastName: string;

  @ApiProperty()
  email: string;

  role: number | PopulatedRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: UserModelData) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.email = data.email;
    this.role = data.role;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}

interface UnsanitizedUserModelData extends UserModelData {
  password: string;
}

export class UnsanitizedUser extends User {
  password: string;

  constructor(data: UnsanitizedUserModelData) {
    super(data);
    this.password = data.password;
  }
}
