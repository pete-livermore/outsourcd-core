import { Reflector } from '@nestjs/core';
import { RolesService } from '../services/roles.service';
import { PermissionsGuard } from './permissions.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

describe('PermissionsGuard', () => {
  let rolesService: RolesService;
  let permissionsGuard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(permissionsGuard).toBeDefined();
  });

  describe('when canActivate is called', () => {
    let mockContext: jest.Mocked<ExecutionContext>;

    beforeEach(() => {
      mockContext = {
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToHttp: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as unknown as jest.Mocked<ExecutionContext>;

      mockContext.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { id: 5, email: 'user@email.com' },
        }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      });
    });

    it('should return true when the user has the required permissions', async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([{ action: 'create', resource: 'test-entity' }]);

      jest.spyOn(rolesService, 'findById').mockResolvedValue({
        id: 1,
        name: 'role-name',
        permissions: [{ id: 7, action: 'create', resource: 'test-entity' }],
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should return false when the user does not have the required permissions', async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([{ action: 'create', resource: 'test-entity' }]);

      jest.spyOn(rolesService, 'findById').mockResolvedValue({
        id: 1,
        name: 'role-name',
        permissions: [],
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should return true when no permissions are required', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = await permissionsGuard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
