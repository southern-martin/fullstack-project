import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto, UserServiceResponse } from '../../application/dto/user.dto';

/**
 * User Service HTTP Client
 *
 * Handles communication with the User Service microservice.
 * Validates user existence and fetches user details.
 */
@Injectable()
export class UserServiceClient {
  private readonly logger = new Logger(UserServiceClient.name);
  private readonly userServiceUrl: string;
  private readonly timeout: number;

  constructor(private readonly configService: ConfigService) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
    this.timeout = this.configService.get<number>('USER_SERVICE_TIMEOUT', 5000);
  }

  /**
   * Validate if a user exists
   *
   * @param userId - The user ID to validate
   * @returns Promise<boolean> - True if user exists and is active
   * @throws HttpException - If User Service is unavailable or user not found
   */
  async validateUser(userId: number): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user && user.isActive;
    } catch (error) {
      this.logger.error(`Failed to validate user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user by ID
   *
   * @param userId - The user ID to fetch
   * @returns Promise<UserDto> - User data
   * @throws HttpException - If user not found or service unavailable
   */
  async getUserById(userId: number): Promise<UserDto> {
    const url = `${this.userServiceUrl}/users/${userId}`;

    try {
      this.logger.debug(`Fetching user from: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new HttpException(`User with id ${userId} not found`, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          `User Service returned status ${response.status}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data: UserServiceResponse = await response.json();
      this.logger.debug(`User fetched successfully: ${userId}`);

      return data.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logger.error(`User Service timeout after ${this.timeout}ms for user ${userId}`);
        throw new HttpException('User Service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to fetch user ${userId}: ${error.message}`);
      throw new HttpException('Failed to communicate with User Service', HttpStatus.BAD_GATEWAY);
    }
  }

  /**
   * Get multiple users by IDs (batch operation)
   *
   * @param userIds - Array of user IDs
   * @returns Promise<UserDto[]> - Array of user data
   */
  async getUsersByIds(userIds: number[]): Promise<UserDto[]> {
    const uniqueIds = [...new Set(userIds)];
    const users: UserDto[] = [];

    // Fetch users in parallel
    const promises = uniqueIds.map((id) =>
      this.getUserById(id).catch((error) => {
        this.logger.warn(`Failed to fetch user ${id}: ${error.message}`);
        return null;
      }),
    );

    const results = await Promise.all(promises);

    for (const user of results) {
      if (user) {
        users.push(user);
      }
    }

    return users;
  }

  /**
   * Check User Service health
   *
   * @returns Promise<boolean> - True if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    const url = `${this.userServiceUrl}/health`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.ok;
    } catch (error) {
      this.logger.warn(`User Service health check failed: ${error.message}`);
      return false;
    }
  }
}
