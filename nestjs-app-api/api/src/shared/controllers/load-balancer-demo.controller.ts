import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { LoadBalancerDemoService } from "../services/load-balancer-demo.service";
import { ServiceInstance } from "../services/load-balancer.service";

/**
 * Load Balancer Demo Controller
 * Provides endpoints to demonstrate load balancing functionality
 */
@Controller("load-balancer-demo")
export class LoadBalancerDemoController {
  private readonly logger = new Logger(LoadBalancerDemoController.name);

  constructor(private readonly loadBalancerDemo: LoadBalancerDemoService) {}

  /**
   * Initialize demo service instances
   */
  @Post("initialize")
  initializeDemoInstances() {
    this.logger.log("Initializing demo service instances");
    try {
      this.loadBalancerDemo.initializeDemoInstances();
      return {
        success: true,
        message: "Demo service instances initialized successfully",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to initialize demo instances:", error);
      return {
        success: false,
        message: "Failed to initialize demo instances",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo round-robin load balancing
   */
  @Get("round-robin/:serviceName")
  demoRoundRobin(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting round-robin demo for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.demoRoundRobinLoadBalancing(
        serviceName,
        10
      );
      return {
        success: true,
        message: `Round-robin load balancing demo completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Round-robin demo failed for ${serviceName}:`, error);
      return {
        success: false,
        message: `Round-robin demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo weighted round-robin load balancing
   */
  @Get("weighted-round-robin/:serviceName")
  demoWeightedRoundRobin(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting weighted round-robin demo for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.demoWeightedRoundRobinLoadBalancing(
        serviceName,
        10
      );
      return {
        success: true,
        message: `Weighted round-robin load balancing demo completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Weighted round-robin demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `Weighted round-robin demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo least connections load balancing
   */
  @Get("least-connections/:serviceName")
  demoLeastConnections(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting least connections demo for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.demoLeastConnectionsLoadBalancing(
        serviceName,
        10
      );
      return {
        success: true,
        message: `Least connections load balancing demo completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Least connections demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `Least connections demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo random load balancing
   */
  @Get("random/:serviceName")
  demoRandom(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting random demo for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.demoRandomLoadBalancing(
        serviceName,
        10
      );
      return {
        success: true,
        message: `Random load balancing demo completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Random demo failed for ${serviceName}:`, error);
      return {
        success: false,
        message: `Random demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo all load balancing strategies
   */
  @Get("all-strategies/:serviceName")
  demoAllStrategies(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting all strategies demo for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.demoAllLoadBalancingStrategies(
        serviceName,
        5
      );
      return {
        success: true,
        message: `All load balancing strategies demo completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `All strategies demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `All strategies demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get load balancer statistics
   */
  @Get("statistics")
  getStatistics() {
    this.logger.log("Getting load balancer statistics");
    try {
      const statistics = this.loadBalancerDemo.getLoadBalancerStatistics();
      return {
        success: true,
        message: "Load balancer statistics retrieved successfully",
        data: statistics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to get load balancer statistics:", error);
      return {
        success: false,
        message: "Failed to get load balancer statistics",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Simulate health check failure
   */
  @Post("simulate-failure/:serviceName/:instanceId")
  simulateHealthCheckFailure(
    @Param("serviceName") serviceName: string,
    @Param("instanceId") instanceId: string
  ) {
    this.logger.log(
      `Simulating health check failure for ${instanceId} in ${serviceName}`
    );
    try {
      this.loadBalancerDemo.simulateHealthCheckFailure(serviceName, instanceId);
      return {
        success: true,
        message: `Health check failure simulated for ${instanceId} in ${serviceName}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to simulate health check failure:`, error);
      return {
        success: false,
        message: "Failed to simulate health check failure",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Simulate health check recovery
   */
  @Post("simulate-recovery/:serviceName/:instanceId")
  simulateHealthCheckRecovery(
    @Param("serviceName") serviceName: string,
    @Param("instanceId") instanceId: string
  ) {
    this.logger.log(
      `Simulating health check recovery for ${instanceId} in ${serviceName}`
    );
    try {
      this.loadBalancerDemo.simulateHealthCheckRecovery(
        serviceName,
        instanceId
      );
      return {
        success: true,
        message: `Health check recovery simulated for ${instanceId} in ${serviceName}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to simulate health check recovery:`, error);
      return {
        success: false,
        message: "Failed to simulate health check recovery",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Add demo instance
   */
  @Post("add-instance/:serviceName")
  addDemoInstance(
    @Param("serviceName") serviceName: string,
    @Body() instance: ServiceInstance
  ) {
    this.logger.log(`Adding demo instance ${instance.id} to ${serviceName}`);
    try {
      this.loadBalancerDemo.addDemoInstance(serviceName, instance);
      return {
        success: true,
        message: `Demo instance ${instance.id} added to ${serviceName}`,
        data: instance,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to add demo instance:`, error);
      return {
        success: false,
        message: "Failed to add demo instance",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Remove demo instance
   */
  @Post("remove-instance/:serviceName/:instanceId")
  removeDemoInstance(
    @Param("serviceName") serviceName: string,
    @Param("instanceId") instanceId: string
  ) {
    this.logger.log(`Removing demo instance ${instanceId} from ${serviceName}`);
    try {
      this.loadBalancerDemo.removeDemoInstance(serviceName, instanceId);
      return {
        success: true,
        message: `Demo instance ${instanceId} removed from ${serviceName}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to remove demo instance:`, error);
      return {
        success: false,
        message: "Failed to remove demo instance",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Performance test
   */
  @Get("performance-test/:serviceName")
  performanceTest(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting performance test for ${serviceName}`);
    try {
      const results = this.loadBalancerDemo.performanceTest(serviceName, 100);
      return {
        success: true,
        message: `Performance test completed for ${serviceName}`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Performance test failed for ${serviceName}:`, error);
      return {
        success: false,
        message: `Performance test failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Run comprehensive load balancer demo
   */
  @Post("run-comprehensive-demo")
  runComprehensiveDemo() {
    this.logger.log("Starting comprehensive load balancer demo");
    try {
      // Initialize demo instances
      this.loadBalancerDemo.initializeDemoInstances();

      // Run demos for user service
      const userServiceResults = {
        roundRobin: this.loadBalancerDemo.demoRoundRobinLoadBalancing(
          "user-service",
          5
        ),
        weightedRoundRobin:
          this.loadBalancerDemo.demoWeightedRoundRobinLoadBalancing(
            "user-service",
            5
          ),
        leastConnections:
          this.loadBalancerDemo.demoLeastConnectionsLoadBalancing(
            "user-service",
            5
          ),
        random: this.loadBalancerDemo.demoRandomLoadBalancing(
          "user-service",
          5
        ),
      };

      // Run demos for customer service
      const customerServiceResults = {
        roundRobin: this.loadBalancerDemo.demoRoundRobinLoadBalancing(
          "customer-service",
          5
        ),
        weightedRoundRobin:
          this.loadBalancerDemo.demoWeightedRoundRobinLoadBalancing(
            "customer-service",
            5
          ),
        leastConnections:
          this.loadBalancerDemo.demoLeastConnectionsLoadBalancing(
            "customer-service",
            5
          ),
        random: this.loadBalancerDemo.demoRandomLoadBalancing(
          "customer-service",
          5
        ),
      };

      // Get statistics
      const statistics = this.loadBalancerDemo.getLoadBalancerStatistics();

      // Performance test
      const performanceTest = this.loadBalancerDemo.performanceTest(
        "user-service",
        50
      );

      return {
        success: true,
        message: "Comprehensive load balancer demo completed successfully",
        data: {
          userServiceResults,
          customerServiceResults,
          statistics,
          performanceTest,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Comprehensive demo failed:", error);
      return {
        success: false,
        message: "Comprehensive demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
