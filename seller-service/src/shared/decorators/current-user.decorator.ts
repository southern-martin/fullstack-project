import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 * Extracts the authenticated user from the request
 *
 * @example
 * @Get('me')
 * getMe(@CurrentUser() user: any) {
 *   return user;
 * }
 *
 * @example
 * // Get specific property
 * getMe(@CurrentUser('id') userId: number) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
