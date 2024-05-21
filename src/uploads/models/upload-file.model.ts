import * as Joi from 'joi';
import { JsonValue } from 'src/kysely-types';

interface CloudinaryProviderMetadata {
  public_id: string;
  resource_type: 'image' | 'video';
}

type ProviderMetadata = CloudinaryProviderMetadata;

export interface UploadFileModelData {
  created_at: Date;
  description: string;
  ext: string;
  id: number;
  mime: string;
  name: string;
  updated_at: Date;
  url: string;
  provider_metadata: JsonValue;
}

export class UploadFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  providerMetadata: ProviderMetadata;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: UploadFileModelData) {
    this.id = data.id;
    this.name = data.name;
    this.url = data.url;
    this.mime = data.mime;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.getMetadata(data.provider_metadata);
  }

  private getMetadata(metadata: JsonValue) {
    const providerSchema: Joi.ObjectSchema<ProviderMetadata> = Joi.object({
      public_id: Joi.string().required(),
      resource_type: Joi.string().required(),
    });

    const result = providerSchema.validate(metadata);

    if (result.error) {
      return null;
    }

    this.providerMetadata = result.value;
  }
}
