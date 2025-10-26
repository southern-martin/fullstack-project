import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../../domain/repositories/role.repository.interface';

/**
 * Health Controller
 * Interface adapter for health check requests
 * Follows Clean Architecture principles by using repository interfaces
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  /**
   * Basic health check endpoint
   * GET /api/v1/health
   */
  @Get()
  @ApiOperation({ summary: "Health check", description: "Check if the service is running" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    version: string;
    environment: string;
  }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "user-service",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    };
  }

  /**
   * Detailed health check endpoint
   * GET /api/v1/health/detailed
   */
  @Get('detailed')
  async detailedHealthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    version: string;
    environment: string;
    checks: {
      database: string;
      users: string;
      roles: string;
    };
    metrics: {
      totalUsers: number;
      totalRoles: number;
      activeUsers: number;
      activeRoles: number;
    };
  }> {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "user-service",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: "ok",
        users: "ok",
        roles: "ok",
      },
      metrics: {
        totalUsers: 0,
        totalRoles: 0,
        activeUsers: 0,
        activeRoles: 0,
      },
    };

    try {
      // Check database connectivity and get metrics
      const [totalUsers, totalRoles, activeUsers, activeRoles] = await Promise.all([
        this.userRepository.count(),
        this.roleRepository.count(),
        this.userRepository.countActive(),
        this.roleRepository.countActive(),
      ]);

      health.metrics = {
        totalUsers,
        totalRoles,
        activeUsers,
        activeRoles,
      };
    } catch (error) {
      health.status = "error";
      health.checks.database = "error";
      health.checks.users = "error";
      health.checks.roles = "error";
    }

    return health;
  }

  /**
   * Readiness probe endpoint
   * GET /api/v1/health/ready
   */
  @Get('ready')
  async readinessCheck(): Promise<{
    status: string;
    timestamp: string;
    error?: string;
  }> {
    try {
      // Check if service is ready to accept requests
      await this.userRepository.count();
      return {
        status: "ready",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "not ready",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  /**
   * Liveness probe endpoint
   * GET /api/v1/health/live
   */
  @Get('live')
  async livenessCheck(): Promise<{
    status: string;
    timestamp: string;
  }> {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }
}
