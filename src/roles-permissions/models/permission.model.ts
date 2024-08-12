export interface PermissionModelData {
  id: number;
  action: string;
  resource: string;
  created_at: Date;
  updated_at: Date;
}

export class Permission {
  id: number;
  action: string;
  resource: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: PermissionModelData) {
    this.id = data.id;
    this.action = data.action;
    this.resource = data.resource;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}
