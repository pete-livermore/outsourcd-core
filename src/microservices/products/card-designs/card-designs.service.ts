import { Injectable } from '@nestjs/common';
import { CardDesign } from './card-design.schema';
import { CreateCardDesignDto } from './dto/create-card-design.dto';
import { CardDesignsRepository } from './card-designs.repository';

@Injectable()
export class CardDesignsService {
  constructor(private readonly cardDesignsRepository: CardDesignsRepository) {}

  async create(createCardDesignDto: CreateCardDesignDto): Promise<CardDesign> {
    return this.cardDesignsRepository.create(createCardDesignDto);
  }

  async getAll(): Promise<CardDesign[]> {
    return this.cardDesignsRepository.getAll();
  }
}
