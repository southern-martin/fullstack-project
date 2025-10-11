import { Injectable, Logger } from "@nestjs/common";
import {
  CircuitBreakerService,
  CircuitBreakerServiceConfig,
} from "./circuit-breaker.service";

export interface ResilienceRetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxRetryDelay: number;
  retryableErrors: string[];
}

export interface TimeoutConfig {
  timeout: number;
  timeoutMessage: string;
}

export interface BulkheadConfig {
  maxConcurrentCalls: number;
  maxWaitTime: number;
}

export interface ResilienceConfig {
  circuitBreaker?: CircuitBreakerServiceConfig;
  retry?: ResilienceRetryConfig;
  timeout?: TimeoutConfig;
  bulkhead?: BulkheadConfig;
}

export interface ResilienceMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  timeoutCalls: number;
  circuitBreakerTrips: number;
  retryAttempts: number;
  averageResponseTime: number;
  lastCallTime: Date;
}

/**
 * Resilience Service
 * Combines multiple resilience patterns: Circuit Breaker, Retry, Timeout, Bulkhead
 */
@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);
  private readonly activeCalls = new Map<string, number>();
  private readonly metrics = new Map<string, ResilienceMetrics>();

  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  /**
   * Execute operation with full resilience patterns
   */
  async execute<T>(
    key: string,
    operation: () => Promise<T>,
    config: ResilienceConfig = {},
    fallback?: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const metrics = this.getOrCreateMetrics(key);

    metrics.totalCalls++;
    metrics.lastCallTime = new Date();

    try {
      // Apply bulkhead pattern
      await this.applyBulkhead(key, config.bulkhead);

      // Apply timeout pattern
      const result = await this.applyTimeout(
        key,
        () =>
          this.applyRetry(
            key,
            () =>
              this.applyCircuitBreaker(
                key,
                operation,
                config.circuitBreaker,
                fallback
              ),
            config.retry
          ),
        config.timeout
      );

      // Record success
      metrics.successfulCalls++;
      metrics.averageResponseTime = this.calculateAverageResponseTime(
        metrics.averageResponseTime,
        Date.now() - startTime,
        metrics.successfulCalls
      );

      return result;
    } catch (error) {
      // Record failure
      metrics.failedCalls++;
      metrics.averageResponseTime = this.calculateAverageResponseTime(
        metrics.averageResponseTime,
        Date.now() - startTime,
        metrics.totalCalls
      );

      this.logger.error(`Resilience operation failed for ${key}:`, error);
      throw error;
    } finally {
      // Release bulkhead
      this.releaseBulkhead(key);
      this.metrics.set(key, metrics);
    }
  }

  /**
   * Apply circuit breaker pattern
   */
  private async applyCircuitBreaker<T>(
    key: string,
    operation: () => Promise<T>,
    config?: CircuitBreakerServiceConfig,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (config) {
      this.circuitBreakerService.registerConfig(key, config);
    }

    return await this.circuitBreakerService.execute(key, operation, fallback);
  }

  /**
   * Apply retry pattern
   */
  private async applyRetry<T>(
    key: string,
    operation: () => Promise<T>,
    config?: ResilienceRetryConfig
  ): Promise<T> {
    if (!config) {
      return await operation();
    }

    const retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxRetryDelay: 10000,
      retryableErrors: ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"],
      ...config,
    };

    let lastError: Error;
    let delay = retryConfig.retryDelay;
    const metrics = this.metrics.get(key)!;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.debug(
            `Retry attempt ${attempt}/${retryConfig.maxRetries} for ${key}`
          );
          metrics.retryAttempts++;
          await this.sleep(delay);
          delay = Math.min(
            delay * retryConfig.backoffMultiplier,
            retryConfig.maxRetryDelay
          );
        }

        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!this.isRetryableError(error, retryConfig.retryableErrors)) {
          throw error;
        }

        if (attempt === retryConfig.maxRetries) {
          this.logger.error(`Max retries exceeded for ${key}`, lastError);
          throw lastError;
        }
      }
    }

    throw lastError!;
  }

  /**
   * Apply timeout pattern
   */
  private async applyTimeout<T>(
    key: string,
    operation: () => Promise<T>,
    config?: TimeoutConfig
  ): Promise<T> {
    if (!config) {
      return await operation();
    }

    const timeoutConfig = {
      timeout: 10000,
      timeoutMessage: `Operation timeout for ${key}`,
      ...config,
    };

    return await Promise.race([
      operation(),
      this.createTimeoutPromise<T>(
        timeoutConfig.timeout,
        timeoutConfig.timeoutMessage
      ),
    ]);
  }

  /**
   * Apply bulkhead pattern
   */
  private async applyBulkhead(
    key: string,
    config?: BulkheadConfig
  ): Promise<void> {
    if (!config) {
      return;
    }

    const bulkheadConfig = {
      maxConcurrentCalls: 10,
      maxWaitTime: 5000,
      ...config,
    };

    const currentCalls = this.activeCalls.get(key) || 0;

    if (currentCalls >= bulkheadConfig.maxConcurrentCalls) {
      // Wait for available slot
      const startWait = Date.now();
      while (currentCalls >= bulkheadConfig.maxConcurrentCalls) {
        if (Date.now() - startWait > bulkheadConfig.maxWaitTime) {
          throw new Error(`Bulkhead timeout for ${key}`);
        }
        await this.sleep(100);
      }
    }

    this.activeCalls.set(key, currentCalls + 1);
  }

  /**
   * Release bulkhead
   */
  private releaseBulkhead(key: string): void {
    const currentCalls = this.activeCalls.get(key) || 0;
    if (currentCalls > 0) {
      this.activeCalls.set(key, currentCalls - 1);
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any, retryableErrors: string[]): boolean {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      // Don't retry on client errors except specific ones
      return [408, 429].includes(error.response.status);
    }

    return retryableErrors.some(
      (errorCode) =>
        error.code === errorCode || error.message?.includes(errorCode)
    );
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise<T>(
    timeout: number,
    message: string
  ): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, timeout);
    });
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(
    currentAverage: number,
    newResponseTime: number,
    totalCalls: number
  ): number {
    return (currentAverage * (totalCalls - 1) + newResponseTime) / totalCalls;
  }

  /**
   * Get or create metrics
   */
  private getOrCreateMetrics(key: string): ResilienceMetrics {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        timeoutCalls: 0,
        circuitBreakerTrips: 0,
        retryAttempts: 0,
        averageResponseTime: 0,
        lastCallTime: new Date(),
      });
    }
    return this.metrics.get(key)!;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get resilience metrics
   */
  getMetrics(key: string): ResilienceMetrics | null {
    return this.metrics.get(key) || null;
  }

  /**
   * Get all resilience metrics
   */
  getAllMetrics(): Record<string, ResilienceMetrics> {
    const allMetrics: Record<string, ResilienceMetrics> = {};
    for (const [key, metrics] of this.metrics.entries()) {
      allMetrics[key] = { ...metrics };
    }
    return allMetrics;
  }

  /**
   * Get bulkhead status
   */
  getBulkheadStatus(): Record<string, { activeCalls: number }> {
    const status: Record<string, { activeCalls: number }> = {};
    for (const [key, calls] of this.activeCalls.entries()) {
      status[key] = { activeCalls: calls };
    }
    return status;
  }

  /**
   * Reset metrics
   */
  resetMetrics(key: string): void {
    this.metrics.delete(key);
    this.activeCalls.delete(key);
    this.logger.debug(`Resilience metrics reset for ${key}`);
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.metrics.clear();
    this.activeCalls.clear();
    this.logger.debug("All resilience metrics reset");
  }

  /**
   * Get resilience health status
   */
  getHealthStatus(): {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageResponseTime: number;
    overallHealth: "healthy" | "degraded" | "unhealthy";
  } {
    const allMetrics = Array.from(this.metrics.values());
    const totalCalls = allMetrics.reduce((sum, m) => sum + m.totalCalls, 0);
    const successfulCalls = allMetrics.reduce(
      (sum, m) => sum + m.successfulCalls,
      0
    );
    const failedCalls = allMetrics.reduce((sum, m) => sum + m.failedCalls, 0);
    const averageResponseTime =
      allMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) /
        allMetrics.length || 0;

    let overallHealth: "healthy" | "degraded" | "unhealthy";
    const successRate = totalCalls > 0 ? successfulCalls / totalCalls : 1;

    if (successRate >= 0.95) {
      overallHealth = "healthy";
    } else if (successRate >= 0.8) {
      overallHealth = "degraded";
    } else {
      overallHealth = "unhealthy";
    }

    return {
      totalOperations: totalCalls,
      successfulOperations: successfulCalls,
      failedOperations: failedCalls,
      averageResponseTime,
      overallHealth,
    };
  }
}
