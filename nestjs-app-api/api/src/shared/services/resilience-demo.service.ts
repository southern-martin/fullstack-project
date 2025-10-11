import { Injectable, Logger } from "@nestjs/common";
import { ResilienceConfig, ResilienceService } from "./resilience.service";
import { ServiceClientFactory } from "./service-client.factory";

/**
 * Resilience Demo Service
 * Demonstrates how to use resilience patterns in service-to-service communication
 */
@Injectable()
export class ResilienceDemoService {
  private readonly logger = new Logger(ResilienceDemoService.name);

  constructor(
    private readonly resilienceService: ResilienceService,
    private readonly serviceClientFactory: ServiceClientFactory
  ) {}

  /**
   * Demo: Call user service with resilience patterns
   */
  async demoUserServiceWithResilience() {
    const userServiceClient =
      this.serviceClientFactory.createUserServiceClient();

    const resilienceConfig: ResilienceConfig = {
      circuitBreaker: {
        failureThreshold: 3,
        recoveryTimeout: 10000, // 10 seconds
        monitoringPeriod: 30000, // 30 seconds
        halfOpenMaxCalls: 2,
      },
      retry: {
        maxRetries: 2,
        retryDelay: 1000,
        backoffMultiplier: 2,
        maxRetryDelay: 5000,
        retryableErrors: ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"],
      },
      timeout: {
        timeout: 5000,
        timeoutMessage: "User service call timeout",
      },
      bulkhead: {
        maxConcurrentCalls: 5,
        maxWaitTime: 3000,
      },
    };

    try {
      const result = await this.resilienceService.execute(
        "user-service:getUsers",
        () => userServiceClient.getUsers({ page: 1, limit: 10 }),
        resilienceConfig,
        () => this.getFallbackUsers()
      );

      this.logger.log("User service call successful with resilience patterns");
      return result;
    } catch (error) {
      this.logger.error(
        "User service call failed even with resilience patterns:",
        error
      );
      throw error;
    }
  }

  /**
   * Demo: Call customer service with different resilience config
   */
  async demoCustomerServiceWithResilience() {
    const customerServiceClient =
      this.serviceClientFactory.createCustomerServiceClient();

    const resilienceConfig: ResilienceConfig = {
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 15000, // 15 seconds
        monitoringPeriod: 60000, // 1 minute
        halfOpenMaxCalls: 3,
      },
      retry: {
        maxRetries: 3,
        retryDelay: 500,
        backoffMultiplier: 1.5,
        maxRetryDelay: 3000,
        retryableErrors: ["ECONNREFUSED", "ETIMEDOUT"],
      },
      timeout: {
        timeout: 8000,
        timeoutMessage: "Customer service call timeout",
      },
    };

    try {
      const result = await this.resilienceService.execute(
        "customer-service:getCustomers",
        () => customerServiceClient.getCustomers({ page: 1, limit: 10 }),
        resilienceConfig,
        () => this.getFallbackCustomers()
      );

      this.logger.log(
        "Customer service call successful with resilience patterns"
      );
      return result;
    } catch (error) {
      this.logger.error(
        "Customer service call failed even with resilience patterns:",
        error
      );
      throw error;
    }
  }

  /**
   * Demo: Simulate service failure to test circuit breaker
   */
  async demoServicFailure() {
    const resilienceConfig: ResilienceConfig = {
      circuitBreaker: {
        failureThreshold: 2,
        recoveryTimeout: 5000, // 5 seconds
        monitoringPeriod: 10000, // 10 seconds
        halfOpenMaxCalls: 1,
      },
      retry: {
        maxRetries: 1,
        retryDelay: 500,
        backoffMultiplier: 2,
        maxRetryDelay: 1000,
        retryableErrors: ["ECONNREFUSED"],
      },
    };

    try {
      const result = await this.resilienceService.execute(
        "demo-service:failing-operation",
        () => this.simulateFailingOperation(),
        resilienceConfig,
        () => this.getFallbackResponse()
      );

      this.logger.log("Demo service call successful");
      return result;
    } catch (error) {
      this.logger.error("Demo service call failed:", error);
      throw error;
    }
  }

  /**
   * Demo: Test bulkhead pattern
   */
  async demoBulkheadPattern() {
    const resilienceConfig: ResilienceConfig = {
      bulkhead: {
        maxConcurrentCalls: 3,
        maxWaitTime: 2000,
      },
      timeout: {
        timeout: 1000,
        timeoutMessage: "Bulkhead demo timeout",
      },
    };

    const promises = [];

    // Create 5 concurrent calls (more than bulkhead limit)
    for (let i = 0; i < 5; i++) {
      promises.push(
        this.resilienceService
          .execute(
            `bulkhead-demo:operation-${i}`,
            () => this.simulateSlowOperation(i),
            resilienceConfig
          )
          .catch((error) => ({ error: error.message, operation: i }))
      );
    }

    const results = await Promise.all(promises);
    this.logger.log("Bulkhead demo completed", results);
    return results;
  }

  /**
   * Simulate a failing operation
   */
  private async simulateFailingOperation(): Promise<any> {
    // Simulate random failure
    if (Math.random() > 0.3) {
      throw new Error("Simulated service failure");
    }

    return { success: true, timestamp: new Date() };
  }

  /**
   * Simulate a slow operation
   */
  private async simulateSlowOperation(operationId: number): Promise<any> {
    const delay = Math.random() * 2000; // 0-2 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
      success: true,
      operationId,
      delay: Math.round(delay),
      timestamp: new Date(),
    };
  }

  /**
   * Fallback response for user service
   */
  private async getFallbackUsers(): Promise<any> {
    this.logger.warn("Using fallback response for user service");
    return {
      users: [
        { id: 1, name: "Fallback User 1", email: "fallback1@example.com" },
        { id: 2, name: "Fallback User 2", email: "fallback2@example.com" },
      ],
      total: 2,
      message: "Using fallback data - user service temporarily unavailable",
    };
  }

  /**
   * Fallback response for customer service
   */
  private async getFallbackCustomers(): Promise<any> {
    this.logger.warn("Using fallback response for customer service");
    return {
      customers: [
        { id: 1, name: "Fallback Customer 1", email: "fallback1@customer.com" },
        { id: 2, name: "Fallback Customer 2", email: "fallback2@customer.com" },
      ],
      total: 2,
      message: "Using fallback data - customer service temporarily unavailable",
    };
  }

  /**
   * Generic fallback response
   */
  private async getFallbackResponse(): Promise<any> {
    this.logger.warn("Using generic fallback response");
    return {
      success: false,
      message: "Service temporarily unavailable",
      fallback: true,
      timestamp: new Date(),
    };
  }

  /**
   * Get resilience metrics for demo
   */
  getDemoMetrics() {
    return {
      userService: this.resilienceService.getMetrics("user-service:getUsers"),
      customerService: this.resilienceService.getMetrics(
        "customer-service:getCustomers"
      ),
      demoService: this.resilienceService.getMetrics(
        "demo-service:failing-operation"
      ),
      bulkheadDemo: this.resilienceService.getMetrics(
        "bulkhead-demo:operation-0"
      ),
      overallHealth: this.resilienceService.getHealthStatus(),
    };
  }
}
