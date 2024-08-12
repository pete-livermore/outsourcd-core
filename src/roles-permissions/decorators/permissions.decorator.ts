import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (
  ...permissions: { action: string; resource: string }[]
) => SetMetadata(PERMISSIONS_KEY, permissions);
