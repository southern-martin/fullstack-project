import { Controller, Get, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { RedisCacheService } from "@shared/infrastructure";
import axios from "axios";

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  service: string;
  checks: {
    database: { status: string; message?: string };
    redis: { status: string; message?: string };
    consul: { status: string; message?: string };
  };
  uptime: number;
  version: string;
}

/**
 * Health Controller
 * Interface adapter for health check requests
 * Includes checks for Consul, Database, and Redis
 * Follows Clean Architecture principles
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  private readonly startTime: number;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject(RedisCacheService) private readonly redisCache: RedisCacheService,
  ) {
    this.startTime = Date.now();
  }

  /**
   * Comprehensive health check endpoint
   * GET /health
   * Checks: Database, Redis, Consul connectivity
   */
  @Get()
  @ApiOperation({ summary: "Comprehensive health check endpoint" })
  @ApiResponse({
    status: 200,
    description: "Service is healthy",
  })
  @ApiResponse({
    status: 503,
    description: "Service is unhealthy",
  })
  async healthCheck(): Promise<HealthCheckResponse> {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      consul: await this.checkConsul(),
    };

    const isHealthy =
      checks.database.status === "ok" &&
      checks.redis.status === "ok" &&
      checks.consul.status === "ok";

    return {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      service: "carrier-service",
      checks,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: "1.0.0",
    };
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<{
    status: string;
    message?: string;
  }> {
    try {
      await this.connection.query("SELECT 1");
      return { status: "ok" };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
      };
    }
  }

  /**
   * Check Redis connectivity
   */
  private async checkRedis(): Promise<{ status: string; message?: string }> {
    try {
      // Test Redis by setting and getting a test key
      const testKey = "health:check";
      const testValue = Date.now().toString();
      await this.redisCache.set(testKey, testValue, { ttl: 5 }); // 5 second TTL
      const retrieved = await this.redisCache.get<string>(testKey);
      
      if (retrieved === testValue) {
        return { status: "ok" };
      }
      return { status: "error", message: "Redis read/write test failed" };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Redis connection failed",
      };
    }
  }

  /**
   * Check Consul connectivity
   */
  private async checkConsul(): Promise<{ status: string; message?: string }> {
    try {
      const consulHost = process.env.CONSUL_HOST || "shared-consul";
      const consulPort = process.env.CONSUL_PORT || "8500";
      const response = await axios.get(
        `http://${consulHost}:${consulPort}/v1/status/leader`,
        { timeout: 5000 }
      );
      
      if (response.status === 200) {
        return { status: "ok" };
      }
      return { status: "error", message: "Consul not responding correctly" };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Consul connection failed",
      };
    }
  }
}
