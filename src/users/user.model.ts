import { ApiProperty } from '@nestjs/swagger';
import { Selectable } from 'kysely';
import { Tables } from 'src/database/database';

interface PopulatedRole {
  id: number;
  name: string;
}

interface PopulatedImage {
  id: number;
  url: string;
}

export type UserModelData = Partial<Selectable<Tables['users']>> & {
  role?: number | PopulatedRole;
  profile_image?: PopulatedImage | null;
};

export class User {
  id: number;
  firstName: string;
  lastName: string;

  @ApiProperty()
  email: string;

  biography: string;
  role: number | PopulatedRole;
  profileImage?: PopulatedImage | null;
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
    this.profileImage = data.profile_image;
    this.biography = data.biography;
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
