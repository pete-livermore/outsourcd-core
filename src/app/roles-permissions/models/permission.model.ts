export interface PermissionModelData {
  id: number;
  action: string;
  entity: string;
  created_at: Date;
  updated_at: Date;
}

export class Permission {
  id: number;
  action: string;
  entity: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: PermissionModelData) {
    this.id = data.id;
    this.action = data.action;
    this.entity = data.entity;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}
