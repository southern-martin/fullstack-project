import { Injectable, Logger } from "@nestjs/common";

export interface CircuitBreakerServiceConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
  halfOpenMaxCalls: number;
}

export interface CircuitBreakerState {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  successCount: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  recoveryTimeout: number;
  halfOpenCalls: number;
}

export interface CircuitBreakerMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  circuitBreakerTrips: number;
  averageResponseTime: number;
  lastTripTime?: Date;
}

/**
 * Advanced Circuit Breaker Service
 * Implements the Circuit Breaker pattern for resilience and fault tolerance
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly metrics = new Map<string, CircuitBreakerMetrics>();
  private readonly configs = new Map<string, CircuitBreakerServiceConfig>();

  /**
   * Register a circuit breaker configuration
   */
  registerConfig(key: string, config: CircuitBreakerServiceConfig): void {
    this.configs.set(key, config);
    this.logger.debug(`Circuit breaker config registered for ${key}`, config);
  }

  /**
   * Get default circuit breaker configuration
   */
  getDefaultConfig(): CircuitBreakerServiceConfig {
    return {
      failureThreshold: 5,
      recoveryTimeout: 30000, // 30 seconds
      monitoringPeriod: 60000, // 1 minute
      halfOpenMaxCalls: 3,
    };
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(
    key: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const config = this.configs.get(key) || this.getDefaultConfig();
    const state = this.getOrCreateState(key, config);
    const metrics = this.getOrCreateMetrics(key);

    // Check if circuit breaker is open
    if (this.isCircuitBreakerOpen(key, state, config)) {
      this.logger.warn(`Circuit breaker OPEN for ${key}, using fallback`);
      metrics.circuitBreakerTrips++;
      metrics.lastTripTime = new Date();

      if (fallback) {
        return await fallback();
      }
      throw new Error(`Circuit breaker OPEN for ${key}`);
    }

    // Check half-open state limits
    if (
      state.state === "HALF_OPEN" &&
      state.halfOpenCalls >= config.halfOpenMaxCalls
    ) {
      this.logger.warn(`Half-open circuit breaker limit reached for ${key}`);
      if (fallback) {
        return await fallback();
      }
      throw new Error(`Half-open circuit breaker limit reached for ${key}`);
    }

    const startTime = Date.now();
    metrics.totalCalls++;

    try {
      // Execute the operation
      const result = await operation();

      // Record success
      this.recordSuccess(key, state, metrics, Date.now() - startTime);

      return result;
    } catch (error) {
      // Record failure
      this.recordFailure(key, state, metrics, Date.now() - startTime);

      // If we have a fallback, use it
      if (fallback) {
        this.logger.debug(`Operation failed for ${key}, using fallback`);
        return await fallback();
      }

      throw error;
    }
  }

  /**
   * Check if circuit breaker is open
   */
  private isCircuitBreakerOpen(
    key: string,
    state: CircuitBreakerState,
    config: CircuitBreakerServiceConfig
  ): boolean {
    if (state.state === "CLOSED") {
      return false;
    }

    if (state.state === "OPEN") {
      // Check if recovery timeout has passed
      if (Date.now() - state.lastFailureTime > config.recoveryTimeout) {
        // Move to half-open state
        state.state = "HALF_OPEN";
        state.halfOpenCalls = 0;
        this.logger.debug(`Circuit breaker ${key} moved to HALF_OPEN`);
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Record successful operation
   */
  private recordSuccess(
    key: string,
    state: CircuitBreakerState,
    metrics: CircuitBreakerMetrics,
    responseTime: number
  ): void {
    state.successCount++;
    state.lastSuccessTime = Date.now();
    metrics.successfulCalls++;
    metrics.averageResponseTime = this.calculateAverageResponseTime(
      metrics.averageResponseTime,
      responseTime,
      metrics.successfulCalls
    );

    if (state.state === "HALF_OPEN") {
      state.halfOpenCalls++;

      // If we've had enough successful calls in half-open state, close the circuit
      if (state.halfOpenCalls >= 2) {
        state.state = "CLOSED";
        state.failureCount = 0;
        state.halfOpenCalls = 0;
        this.logger.debug(`Circuit breaker ${key} moved to CLOSED`);
      }
    }

    this.circuitBreakers.set(key, state);
    this.metrics.set(key, metrics);
  }

  /**
   * Record failed operation
   */
  private recordFailure(
    key: string,
    state: CircuitBreakerState,
    metrics: CircuitBreakerMetrics,
    responseTime: number
  ): void {
    state.failureCount++;
    state.lastFailureTime = Date.now();
    metrics.failedCalls++;
    metrics.averageResponseTime = this.calculateAverageResponseTime(
      metrics.averageResponseTime,
      responseTime,
      metrics.totalCalls
    );

    // Check if we should open the circuit breaker
    if (state.failureCount >= this.configs.get(key)?.failureThreshold || 5) {
      state.state = "OPEN";
      state.halfOpenCalls = 0;
      this.logger.warn(`Circuit breaker ${key} moved to OPEN`);
    }

    this.circuitBreakers.set(key, state);
    this.metrics.set(key, metrics);
  }

  /**
   * Get or create circuit breaker state
   */
  private getOrCreateState(
    key: string,
    config: CircuitBreakerServiceConfig
  ): CircuitBreakerState {
    if (!this.circuitBreakers.has(key)) {
      this.circuitBreakers.set(key, {
        state: "CLOSED",
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        lastSuccessTime: 0,
        recoveryTimeout: config.recoveryTimeout,
        halfOpenCalls: 0,
      });
    }
    return this.circuitBreakers.get(key)!;
  }

  /**
   * Get or create metrics
   */
  private getOrCreateMetrics(key: string): CircuitBreakerMetrics {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        circuitBreakerTrips: 0,
        averageResponseTime: 0,
      });
    }
    return this.metrics.get(key)!;
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
   * Get circuit breaker status
   */
  getStatus(key: string): CircuitBreakerState | null {
    return this.circuitBreakers.get(key) || null;
  }

  /**
   * Get circuit breaker metrics
   */
  getMetrics(key: string): CircuitBreakerMetrics | null {
    return this.metrics.get(key) || null;
  }

  /**
   * Get all circuit breaker statuses
   */
  getAllStatuses(): Record<string, CircuitBreakerState> {
    const statuses: Record<string, CircuitBreakerState> = {};
    for (const [key, state] of this.circuitBreakers.entries()) {
      statuses[key] = { ...state };
    }
    return statuses;
  }

  /**
   * Get all circuit breaker metrics
   */
  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const allMetrics: Record<string, CircuitBreakerMetrics> = {};
    for (const [key, metrics] of this.metrics.entries()) {
      allMetrics[key] = { ...metrics };
    }
    return allMetrics;
  }

  /**
   * Reset circuit breaker
   */
  reset(key: string): void {
    this.circuitBreakers.delete(key);
    this.metrics.delete(key);
    this.logger.debug(`Circuit breaker ${key} reset`);
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.circuitBreakers.clear();
    this.metrics.clear();
    this.logger.debug("All circuit breakers reset");
  }

  /**
   * Force circuit breaker to open
   */
  forceOpen(key: string): void {
    const state = this.circuitBreakers.get(key);
    if (state) {
      state.state = "OPEN";
      state.failureCount = 999; // High number to keep it open
      this.circuitBreakers.set(key, state);
      this.logger.warn(`Circuit breaker ${key} forced to OPEN`);
    }
  }

  /**
   * Force circuit breaker to close
   */
  forceClose(key: string): void {
    const state = this.circuitBreakers.get(key);
    if (state) {
      state.state = "CLOSED";
      state.failureCount = 0;
      state.halfOpenCalls = 0;
      this.circuitBreakers.set(key, state);
      this.logger.debug(`Circuit breaker ${key} forced to CLOSED`);
    }
  }

  /**
   * Get circuit breaker health status
   */
  getHealthStatus(): {
    totalCircuitBreakers: number;
    openCircuitBreakers: number;
    halfOpenCircuitBreakers: number;
    closedCircuitBreakers: number;
    overallHealth: "healthy" | "degraded" | "unhealthy";
  } {
    const states = Array.from(this.circuitBreakers.values());
    const openCount = states.filter((s) => s.state === "OPEN").length;
    const halfOpenCount = states.filter((s) => s.state === "HALF_OPEN").length;
    const closedCount = states.filter((s) => s.state === "CLOSED").length;

    let overallHealth: "healthy" | "degraded" | "unhealthy";
    if (openCount === 0 && halfOpenCount === 0) {
      overallHealth = "healthy";
    } else if (openCount === 0 && halfOpenCount > 0) {
      overallHealth = "degraded";
    } else {
      overallHealth = "unhealthy";
    }

    return {
      totalCircuitBreakers: states.length,
      openCircuitBreakers: openCount,
      halfOpenCircuitBreakers: halfOpenCount,
      closedCircuitBreakers: closedCount,
      overallHealth,
    };
  }
}
