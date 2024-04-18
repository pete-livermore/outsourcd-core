import { Test, TestingModule } from '@nestjs/testing';
import { CardDesignsService } from './card-designs.service';
import { CardDesign } from './card-design.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MockCardDesignModel } from './mocks/mock-card-design.model';
import { CardDesignsRepository } from './card-designs.repository';

describe('CardDesignsService', () => {
  let mockRepository: CardDesignsRepository;
  let service: CardDesignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CardDesign],
      providers: [
        CardDesignsService,
        {
          provide: CardDesignsRepository,
          useValue: {
            getAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(CardDesign.name),
          useClass: MockCardDesignModel,
        },
      ],
    }).compile();

    mockRepository = module.get<CardDesignsRepository>(CardDesignsRepository);
    service = module.get<CardDesignsService>(CardDesignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should call cardDesignsRepository.getAll', async () => {
      await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
    });
  });
});
