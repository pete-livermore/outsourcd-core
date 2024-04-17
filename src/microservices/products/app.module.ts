import { Module } from '@nestjs/common';
import { MongodbModule } from './mongodb/mongodb.module';
import { CardDesignsModule } from './card-designs/card-designs.module';

@Module({
  imports: [MongodbModule, CardDesignsModule],
})
export class AppModule {}
