import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolesService } from '../services/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Should this be getAllAndMerge?
    const requiredPermissions = this.reflector.getAllAndOverride<
      { action: string; resource: string }[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const { user }: { user: { id: number; email: string; role: number } } =
      context.switchToHttp().getRequest();

    const userRole = await this.rolesService.findById(user.role, {
      permissions: true,
    });

    const userPermissionSet = new Set(
      userRole.permissions.map((perm) => `${perm.action}_${perm.resource}`),
    );

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissionSet.has(`${perm.action}_${perm.resource}`),
    );

    return hasPermission;
  }
}
