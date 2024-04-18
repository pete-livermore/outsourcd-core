import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardDesign, CardDesignSchema } from './card-design.schema';
import { CardDesignsService } from './card-designs.service';
import { CardDesignsRepository } from './card-designs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardDesign.name, schema: CardDesignSchema },
    ]),
  ],
  providers: [CardDesignsRepository, CardDesignsService],
})
export class CardDesignsModule {}
