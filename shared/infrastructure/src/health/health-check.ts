import { Logger } from '../logging/logger';

/**
 * Health Check Status
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded',
}

/**
 * Health Check Result
 */
export interface HealthCheckResult {
  status: HealthStatus;
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
  error?: string;
}

/**
 * Health Check Interface
 */
export interface IHealthCheck {
  name: string;
  check(): Promise<HealthCheckResult>;
}

/**
 * Health Check
 * 
 * Base class for health checks with common functionality.
 */
export abstract class HealthCheck implements IHealthCheck {
  constructor(
    public readonly name: string,
    protected readonly logger: Logger
  ) {}

  /**
   * Perform health check
   */
  abstract check(): Promise<HealthCheckResult>;

  /**
   * Create healthy result
   */
  protected createHealthyResult(message: string, details?: Record<string, any>): HealthCheckResult {
    return {
      status: HealthStatus.HEALTHY,
      message,
      timestamp: new Date(),
      details,
    };
  }

  /**
   * Create unhealthy result
   */
  protected createUnhealthyResult(message: string, error?: string, details?: Record<string, any>): HealthCheckResult {
    return {
      status: HealthStatus.UNHEALTHY,
      message,
      timestamp: new Date(),
      error,
      details,
    };
  }

  /**
   * Create degraded result
   */
  protected createDegradedResult(message: string, details?: Record<string, any>): HealthCheckResult {
    return {
      status: HealthStatus.DEGRADED,
      message,
      timestamp: new Date(),
      details,
    };
  }
}
