import { Test, TestingModule } from '@nestjs/testing';

import { RolesRepository } from '../repositories/roles.repository';
import { mockRolesRepository } from '../test-utils/mocks/roles.repository.mock';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RolesRepository,
          useValue: mockRolesRepository,
        },
      ],
    }).compile();
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
