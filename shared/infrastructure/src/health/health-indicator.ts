import { HealthCheck, HealthCheckResult, HealthStatus } from './health-check';
import { Logger } from '../logging/logger';
import { ConnectionManager } from '../database/connection-manager';

/**
 * Database Health Indicator
 */
export class DatabaseHealthIndicator extends HealthCheck {
  constructor(
    private readonly connectionManager: ConnectionManager,
    logger: Logger
  ) {
    super('database', logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      const health = await this.connectionManager.getHealth();
      
      if (health.status === 'connected') {
        return this.createHealthyResult('Database connection is healthy', health.details);
      } else {
        return this.createUnhealthyResult('Database connection failed', health.details?.error);
      }
    } catch (error) {
      this.logger.error('Database health check failed', error as Error);
      return this.createUnhealthyResult('Database health check failed', (error as Error).message);
    }
  }
}

/**
 * Redis Health Indicator
 */
export class RedisHealthIndicator extends HealthCheck {
  constructor(
    private readonly redisClient: any,
    logger: Logger
  ) {
    super('redis', logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      // Simple ping test
      const result = await this.redisClient.ping();
      
      if (result === 'PONG') {
        return this.createHealthyResult('Redis connection is healthy');
      } else {
        return this.createUnhealthyResult('Redis ping failed');
      }
    } catch (error) {
      this.logger.error('Redis health check failed', error as Error);
      return this.createUnhealthyResult('Redis health check failed', (error as Error).message);
    }
  }
}

/**
 * External Service Health Indicator
 */
export class ExternalServiceHealthIndicator extends HealthCheck {
  constructor(
    private readonly serviceName: string,
    private readonly serviceUrl: string,
    private readonly httpClient: any,
    logger: Logger
  ) {
    super(`external-service-${serviceName}`, logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      const response = await this.httpClient.get(`${this.serviceUrl}/health`);
      
      if (response.success && response.status === 200) {
        return this.createHealthyResult(`${this.serviceName} service is healthy`, {
          url: this.serviceUrl,
          responseTime: response.metadata?.duration,
        });
      } else {
        return this.createUnhealthyResult(`${this.serviceName} service is unhealthy`, undefined, {
          url: this.serviceUrl,
          status: response.status,
        });
      }
    } catch (error) {
      this.logger.error(`${this.serviceName} health check failed`, error as Error);
      return this.createUnhealthyResult(`${this.serviceName} service is unreachable`, (error as Error).message);
    }
  }
}

/**
 * Memory Health Indicator
 */
export class MemoryHealthIndicator extends HealthCheck {
  constructor(logger: Logger) {
    super('memory', logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      const details = {
        heapUsed: Math.round(usedMemory / 1024 / 1024), // MB
        heapTotal: Math.round(totalMemory / 1024 / 1024), // MB
        memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      };

      if (memoryUsagePercent > 90) {
        return this.createUnhealthyResult('Memory usage is critically high', undefined, details);
      } else if (memoryUsagePercent > 80) {
        return this.createDegradedResult('Memory usage is high', details);
      } else {
        return this.createHealthyResult('Memory usage is normal', details);
      }
    } catch (error) {
      this.logger.error('Memory health check failed', error as Error);
      return this.createUnhealthyResult('Memory health check failed', (error as Error).message);
    }
  }
}

/**
 * Disk Health Indicator
 */
export class DiskHealthIndicator extends HealthCheck {
  constructor(
    private readonly path: string = '/',
    logger: Logger
  ) {
    super('disk', logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      const fs = require('fs');
      const stats = fs.statSync(this.path);
      
      // This is a simplified check - in production you'd want to use a proper disk usage library
      return this.createHealthyResult('Disk health check passed', {
        path: this.path,
        lastModified: stats.mtime,
      });
    } catch (error) {
      this.logger.error('Disk health check failed', error as Error);
      return this.createUnhealthyResult('Disk health check failed', (error as Error).message);
    }
  }
}

/**
 * CPU Health Indicator
 */
export class CpuHealthIndicator extends HealthCheck {
  constructor(logger: Logger) {
    super('cpu', logger);
  }

  async check(): Promise<HealthCheckResult> {
    try {
      const os = require('os');
      const loadAvg = os.loadavg();
      const cpuCount = os.cpus().length;
      const loadPercent = (loadAvg[0] / cpuCount) * 100;

      const details = {
        loadAverage: loadAvg[0],
        cpuCount,
        loadPercent: Math.round(loadPercent * 100) / 100,
        uptime: os.uptime(),
      };

      if (loadPercent > 90) {
        return this.createUnhealthyResult('CPU load is critically high', undefined, details);
      } else if (loadPercent > 80) {
        return this.createDegradedResult('CPU load is high', details);
      } else {
        return this.createHealthyResult('CPU load is normal', details);
      }
    } catch (error) {
      this.logger.error('CPU health check failed', error as Error);
      return this.createUnhealthyResult('CPU health check failed', (error as Error).message);
    }
  }
}
