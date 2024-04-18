import { Test, TestingModule } from '@nestjs/testing';
import { CardDesignsRepository } from './card-designs.repository';
import { CardDesign } from './card-design.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MockCardDesignModel } from './mocks/mock-card-design.model';
import { Model } from 'mongoose';

describe('CardDesignsRepository', () => {
  let mockCardDesignModel: Model<CardDesign>;
  let repository: CardDesignsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CardDesign],
      providers: [
        CardDesignsRepository,
        {
          provide: getModelToken(CardDesign.name),
          useClass: MockCardDesignModel,
        },
      ],
    }).compile();

    repository = module.get<CardDesignsRepository>(CardDesignsRepository);
    mockCardDesignModel = module.get<Model<CardDesign>>(
      getModelToken(CardDesign.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should call this.cardDesignModel.find().exec()', async () => {
      await repository.getAll();

      expect(mockCardDesignModel.find).toHaveBeenCalled();
      expect(mockCardDesignModel.find().exec).toHaveBeenCalled();
    });
  });
});
