/**
 * User Data Transfer Object
 *
 * Represents user data received from the User Service.
 * Used for validation and caching.
 */
export class UserDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  isActive: boolean;
}

/**
 * User Service Response
 *
 * Standard response format from User Service API
 */
export interface UserServiceResponse {
  data: UserDto;
}
