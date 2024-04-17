import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { RolesService } from './services/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<number[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    const { user }: { user: { id: number; email: string; role: number } } =
      context.switchToHttp().getRequest();

    const userRole = await this.rolesService.findById(user.role, {
      permissions: true,
    });

    const hasPermission = requiredPermissions.some((requiredPermissionId) =>
      userRole.permissions.includes(requiredPermissionId),
    );

    return hasPermission;
  }
}
