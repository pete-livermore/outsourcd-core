import { Test, TestingModule } from '@nestjs/testing';

import { RolesController } from './roles.controller';
import { RolesService } from '../services/roles.service';
import { mockRolesService } from '../test-utils/mocks/roles.service.mock';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockRolesService }],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
