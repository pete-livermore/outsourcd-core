export interface UploadFileModelData {
  created_at: Date;
  description: string;
  ext: string;
  id: number;
  mime: string;
  name: string;
  updated_at: Date;
  url: string;
}

export class UploadFile {
  id: number;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  constructor({ id, name, url, created_at, updated_at }: UploadFileModelData) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}
