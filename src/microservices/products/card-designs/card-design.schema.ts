import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDesignDocument = HydratedDocument<CardDesign>;

@Schema()
export class CardDesign {
  @Prop({ required: true })
  name: string;

  @Prop()
  frontImageURL: string;

  @Prop()
  insideText: string;

  @Prop()
  backText: string;

  @Prop([String])
  sizes: string[];

  @Prop()
  price: number;
}

export const CardDesignSchema = SchemaFactory.createForClass(CardDesign);
