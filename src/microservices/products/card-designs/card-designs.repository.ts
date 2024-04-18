import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardDesign } from './card-design.schema';
import { CreateCardDesignDto } from './dto/create-card-design.dto';

@Injectable()
export class CardDesignsRepository {
  constructor(
    @InjectModel(CardDesign.name) private catModel: Model<CardDesign>,
  ) {}

  async create(createCardDesignDto: CreateCardDesignDto): Promise<CardDesign> {
    const createdCat = new this.catModel(createCardDesignDto);
    return createdCat.save();
  }

  async getAll(): Promise<CardDesign[]> {
    return this.catModel.find().exec();
  }
}
