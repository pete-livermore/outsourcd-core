interface PermissionRelation {
  id: number;
  resource: string;
  action: string;
}

export interface RoleModelData {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  permissions?: PermissionRelation[];
}

export class Role {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: PermissionRelation[];
  constructor(data: RoleModelData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;

    if (data.permissions) {
      this.permissions = data.permissions;
    }
  }
}
