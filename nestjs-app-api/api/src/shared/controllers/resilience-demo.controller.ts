import { Controller, Get, Logger, Post } from "@nestjs/common";
import { ResilienceDemoService } from "../services/resilience-demo.service";

/**
 * Resilience Demo Controller
 * Provides endpoints to demonstrate resilience patterns
 */
@Controller("resilience-demo")
export class ResilienceDemoController {
  private readonly logger = new Logger(ResilienceDemoController.name);

  constructor(private readonly resilienceDemoService: ResilienceDemoService) {}

  /**
   * Demo user service with resilience patterns
   */
  @Get("user-service")
  async demoUserService() {
    this.logger.log("Starting user service resilience demo");
    try {
      const result =
        await this.resilienceDemoService.demoUserServiceWithResilience();
      return {
        success: true,
        message: "User service resilience demo completed successfully",
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("User service resilience demo failed:", error);
      return {
        success: false,
        message: "User service resilience demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo customer service with resilience patterns
   */
  @Get("customer-service")
  async demoCustomerService() {
    this.logger.log("Starting customer service resilience demo");
    try {
      const result =
        await this.resilienceDemoService.demoCustomerServiceWithResilience();
      return {
        success: true,
        message: "Customer service resilience demo completed successfully",
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Customer service resilience demo failed:", error);
      return {
        success: false,
        message: "Customer service resilience demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo service failure to test circuit breaker
   */
  @Post("simulate-failure")
  async simulateServiceFailure() {
    this.logger.log("Starting service failure simulation demo");
    try {
      const result = await this.resilienceDemoService.demoServicFailure();
      return {
        success: true,
        message: "Service failure simulation demo completed",
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Service failure simulation demo failed:", error);
      return {
        success: false,
        message: "Service failure simulation demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo bulkhead pattern
   */
  @Get("bulkhead")
  async demoBulkheadPattern() {
    this.logger.log("Starting bulkhead pattern demo");
    try {
      const result = await this.resilienceDemoService.demoBulkheadPattern();
      return {
        success: true,
        message: "Bulkhead pattern demo completed",
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Bulkhead pattern demo failed:", error);
      return {
        success: false,
        message: "Bulkhead pattern demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get resilience demo metrics
   */
  @Get("metrics")
  async getDemoMetrics() {
    this.logger.log("Getting resilience demo metrics");
    try {
      const metrics = this.resilienceDemoService.getDemoMetrics();
      return {
        success: true,
        message: "Resilience demo metrics retrieved successfully",
        data: metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to get resilience demo metrics:", error);
      return {
        success: false,
        message: "Failed to get resilience demo metrics",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Run all resilience demos
   */
  @Post("run-all")
  async runAllDemos() {
    this.logger.log("Starting all resilience demos");
    const results = {
      userService: null,
      customerService: null,
      serviceFailure: null,
      bulkhead: null,
      metrics: null,
    };

    try {
      // Run user service demo
      try {
        results.userService =
          await this.resilienceDemoService.demoUserServiceWithResilience();
      } catch (error) {
        results.userService = { error: error.message };
      }

      // Run customer service demo
      try {
        results.customerService =
          await this.resilienceDemoService.demoCustomerServiceWithResilience();
      } catch (error) {
        results.customerService = { error: error.message };
      }

      // Run service failure demo
      try {
        results.serviceFailure =
          await this.resilienceDemoService.demoServicFailure();
      } catch (error) {
        results.serviceFailure = { error: error.message };
      }

      // Run bulkhead demo
      try {
        results.bulkhead =
          await this.resilienceDemoService.demoBulkheadPattern();
      } catch (error) {
        results.bulkhead = { error: error.message };
      }

      // Get metrics
      try {
        results.metrics = this.resilienceDemoService.getDemoMetrics();
      } catch (error) {
        results.metrics = { error: error.message };
      }

      return {
        success: true,
        message: "All resilience demos completed",
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to run all resilience demos:", error);
      return {
        success: false,
        message: "Failed to run all resilience demos",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
