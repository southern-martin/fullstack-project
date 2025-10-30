import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * Specifies which roles are required to access an endpoint
 *
 * @example
 * @Roles('admin')
 * @Roles('admin', 'seller')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
