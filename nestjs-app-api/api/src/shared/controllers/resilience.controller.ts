import { Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { ResilienceService } from "../services/resilience.service";

/**
 * Resilience Controller
 * Provides endpoints for monitoring and managing resilience patterns
 */
@Controller("resilience")
export class ResilienceController {
  private readonly logger = new Logger(ResilienceController.name);

  constructor(
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly resilienceService: ResilienceService
  ) {}

  /**
   * Get circuit breaker status for all services
   */
  @Get("circuit-breakers")
  getCircuitBreakerStatus() {
    return {
      statuses: this.circuitBreakerService.getAllStatuses(),
      health: this.circuitBreakerService.getHealthStatus(),
    };
  }

  /**
   * Get circuit breaker status for specific service
   */
  @Get("circuit-breakers/:key")
  getCircuitBreakerStatusByKey(@Param("key") key: string) {
    const status = this.circuitBreakerService.getStatus(key);
    const metrics = this.circuitBreakerService.getMetrics(key);

    if (!status) {
      return { error: `Circuit breaker not found for key: ${key}` };
    }

    return {
      key,
      status,
      metrics,
    };
  }

  /**
   * Get circuit breaker metrics for all services
   */
  @Get("circuit-breakers/metrics")
  getCircuitBreakerMetrics() {
    return this.circuitBreakerService.getAllMetrics();
  }

  /**
   * Reset circuit breaker for specific service
   */
  @Post("circuit-breakers/:key/reset")
  resetCircuitBreaker(@Param("key") key: string) {
    this.circuitBreakerService.reset(key);
    this.logger.log(`Circuit breaker reset for key: ${key}`);
    return { message: `Circuit breaker reset for key: ${key}` };
  }

  /**
   * Reset all circuit breakers
   */
  @Post("circuit-breakers/reset-all")
  resetAllCircuitBreakers() {
    this.circuitBreakerService.resetAll();
    this.logger.log("All circuit breakers reset");
    return { message: "All circuit breakers reset" };
  }

  /**
   * Force circuit breaker to open
   */
  @Post("circuit-breakers/:key/force-open")
  forceCircuitBreakerOpen(@Param("key") key: string) {
    this.circuitBreakerService.forceOpen(key);
    this.logger.log(`Circuit breaker forced to open for key: ${key}`);
    return { message: `Circuit breaker forced to open for key: ${key}` };
  }

  /**
   * Force circuit breaker to close
   */
  @Post("circuit-breakers/:key/force-close")
  forceCircuitBreakerClose(@Param("key") key: string) {
    this.circuitBreakerService.forceClose(key);
    this.logger.log(`Circuit breaker forced to close for key: ${key}`);
    return { message: `Circuit breaker forced to close for key: ${key}` };
  }

  /**
   * Get resilience metrics for all services
   */
  @Get("metrics")
  getResilienceMetrics() {
    return {
      metrics: this.resilienceService.getAllMetrics(),
      bulkheadStatus: this.resilienceService.getBulkheadStatus(),
      health: this.resilienceService.getHealthStatus(),
    };
  }

  /**
   * Get resilience metrics for specific service
   */
  @Get("metrics/:key")
  getResilienceMetricsByKey(@Param("key") key: string) {
    const metrics = this.resilienceService.getMetrics(key);

    if (!metrics) {
      return { error: `Resilience metrics not found for key: ${key}` };
    }

    return {
      key,
      metrics,
    };
  }

  /**
   * Reset resilience metrics for specific service
   */
  @Post("metrics/:key/reset")
  resetResilienceMetrics(@Param("key") key: string) {
    this.resilienceService.resetMetrics(key);
    this.logger.log(`Resilience metrics reset for key: ${key}`);
    return { message: `Resilience metrics reset for key: ${key}` };
  }

  /**
   * Reset all resilience metrics
   */
  @Post("metrics/reset-all")
  resetAllResilienceMetrics() {
    this.resilienceService.resetAllMetrics();
    this.logger.log("All resilience metrics reset");
    return { message: "All resilience metrics reset" };
  }

  /**
   * Get overall resilience health status
   */
  @Get("health")
  getResilienceHealth() {
    return {
      circuitBreakers: this.circuitBreakerService.getHealthStatus(),
      resilience: this.resilienceService.getHealthStatus(),
      timestamp: new Date().toISOString(),
    };
  }
}
