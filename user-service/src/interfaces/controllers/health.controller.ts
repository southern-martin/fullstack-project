import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DataSource } from 'typeorm';
import axios from 'axios';
import { RedisCacheService } from '@shared/infrastructure';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../../domain/repositories/role.repository.interface';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  message: string;
  responseTime?: number;
}

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  checks: {
    database: HealthCheckResult;
    redis: HealthCheckResult;
    consul: HealthCheckResult;
  };
}

/**
 * Health Controller
 * Interface adapter for health check requests
 * Follows Clean Architecture principles by using repository interfaces
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    private readonly redisCache: RedisCacheService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  /**
   * Comprehensive health check endpoint
   * GET /api/v1/health
   * 
   * Checks database, Redis, and Consul availability
   */
  @Get()
  @ApiOperation({ summary: "Health check", description: "Check if the service is running and all dependencies are healthy" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  async healthCheck(): Promise<HealthCheckResponse> {
    const startTime = Date.now();

    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      consul: await this.checkConsul(),
    };

    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    const anyUnhealthy = Object.values(checks).some(check => check.status === 'unhealthy');

    return {
      status: anyUnhealthy ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'user-service',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
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
      database: HealthCheckResult;
      redis: HealthCheckResult;
      consul: HealthCheckResult;
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
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        consul: await this.checkConsul(),
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

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database check failed: ${error.message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check Redis connectivity
   */
  private async checkRedis(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const testKey = `health:check:${Date.now()}`;
      const testValue = 'ok';
      await this.redisCache.set(testKey, testValue, { ttl: 5 });
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        message: 'Redis connection is healthy',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Redis check failed: ${error.message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check Consul availability
   */
  private async checkConsul(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const consulHost = process.env.CONSUL_HOST || 'consul-server';
      const consulPort = process.env.CONSUL_PORT || '8500';
      const consulScheme = process.env.CONSUL_SCHEME || 'http';
      const consulUrl = `${consulScheme}://${consulHost}:${consulPort}`;
      const response = await axios.get(`${consulUrl}/v1/status/leader`, {
        timeout: 5000,
      });
      const responseTime = Date.now() - startTime;
      
      if (response.data) {
        return {
          status: 'healthy',
          message: 'Consul is available',
          responseTime,
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Consul leader not found',
          responseTime,
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Consul check failed: ${error.message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }
}

