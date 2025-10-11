import { Injectable, Logger } from "@nestjs/common";
import { LoadBalancerService, ServiceInstance } from "./load-balancer.service";

/**
 * Load Balancer Demo Service
 * Demonstrates load balancing functionality with multiple service instances
 */
@Injectable()
export class LoadBalancerDemoService {
  private readonly logger = new Logger(LoadBalancerDemoService.name);

  constructor(private readonly loadBalancer: LoadBalancerService) {}

  /**
   * Initialize demo service instances
   */
  initializeDemoInstances(): void {
    // Create demo instances for user service
    const userServiceInstances: ServiceInstance[] = [
      {
        id: "user-service-1",
        url: "http://localhost:3001/api/v1/users",
        weight: 1,
        health: "healthy",
        lastHealthCheck: new Date(),
        responseTime: 50,
        activeConnections: 0,
      },
      {
        id: "user-service-2",
        url: "http://localhost:3002/api/v1/users",
        weight: 2,
        health: "healthy",
        lastHealthCheck: new Date(),
        responseTime: 75,
        activeConnections: 0,
      },
      {
        id: "user-service-3",
        url: "http://localhost:3003/api/v1/users",
        weight: 1,
        health: "healthy",
        lastHealthCheck: new Date(),
        responseTime: 100,
        activeConnections: 0,
      },
    ];

    // Create demo instances for customer service
    const customerServiceInstances: ServiceInstance[] = [
      {
        id: "customer-service-1",
        url: "http://localhost:3001/api/v1/customers",
        weight: 1,
        health: "healthy",
        lastHealthCheck: new Date(),
        responseTime: 60,
        activeConnections: 0,
      },
      {
        id: "customer-service-2",
        url: "http://localhost:3002/api/v1/customers",
        weight: 1,
        health: "unhealthy",
        lastHealthCheck: new Date(),
        responseTime: 2000,
        activeConnections: 0,
      },
    ];

    // Register service instances
    this.loadBalancer.registerServiceInstances(
      "user-service",
      userServiceInstances
    );
    this.loadBalancer.registerServiceInstances(
      "customer-service",
      customerServiceInstances
    );

    this.logger.log("Demo service instances initialized");
  }

  /**
   * Demo round-robin load balancing
   */
  demoRoundRobinLoadBalancing(
    serviceName: string,
    requests: number = 10
  ): any[] {
    const results = [];
    const strategy = this.loadBalancer.getStrategy("round-robin");

    for (let i = 0; i < requests; i++) {
      const instance = this.loadBalancer.selectInstance(serviceName, strategy);
      if (instance) {
        results.push({
          request: i + 1,
          selectedInstance: instance.id,
          url: instance.url,
          weight: instance.weight,
          health: instance.health,
          responseTime: instance.responseTime,
        });
      } else {
        results.push({
          request: i + 1,
          error: "No healthy instances available",
        });
      }
    }

    this.logger.log(
      `Round-robin demo completed for ${serviceName} with ${requests} requests`
    );
    return results;
  }

  /**
   * Demo weighted round-robin load balancing
   */
  demoWeightedRoundRobinLoadBalancing(
    serviceName: string,
    requests: number = 10
  ): any[] {
    const results = [];
    const strategy = this.loadBalancer.getStrategy("weighted-round-robin");

    for (let i = 0; i < requests; i++) {
      const instance = this.loadBalancer.selectInstance(serviceName, strategy);
      if (instance) {
        results.push({
          request: i + 1,
          selectedInstance: instance.id,
          url: instance.url,
          weight: instance.weight,
          health: instance.health,
          responseTime: instance.responseTime,
        });
      } else {
        results.push({
          request: i + 1,
          error: "No healthy instances available",
        });
      }
    }

    this.logger.log(
      `Weighted round-robin demo completed for ${serviceName} with ${requests} requests`
    );
    return results;
  }

  /**
   * Demo least connections load balancing
   */
  demoLeastConnectionsLoadBalancing(
    serviceName: string,
    requests: number = 10
  ): any[] {
    const results = [];
    const strategy = this.loadBalancer.getStrategy("least-connections");

    for (let i = 0; i < requests; i++) {
      const instance = this.loadBalancer.selectInstance(serviceName, strategy);
      if (instance) {
        // Simulate connection increase
        this.loadBalancer.updateInstanceMetrics(instance.id, {
          activeConnections: instance.activeConnections + 1,
        });

        results.push({
          request: i + 1,
          selectedInstance: instance.id,
          url: instance.url,
          weight: instance.weight,
          health: instance.health,
          responseTime: instance.responseTime,
          activeConnections: instance.activeConnections + 1,
        });
      } else {
        results.push({
          request: i + 1,
          error: "No healthy instances available",
        });
      }
    }

    this.logger.log(
      `Least connections demo completed for ${serviceName} with ${requests} requests`
    );
    return results;
  }

  /**
   * Demo random load balancing
   */
  demoRandomLoadBalancing(serviceName: string, requests: number = 10): any[] {
    const results = [];
    const strategy = this.loadBalancer.getStrategy("random");

    for (let i = 0; i < requests; i++) {
      const instance = this.loadBalancer.selectInstance(serviceName, strategy);
      if (instance) {
        results.push({
          request: i + 1,
          selectedInstance: instance.id,
          url: instance.url,
          weight: instance.weight,
          health: instance.health,
          responseTime: instance.responseTime,
        });
      } else {
        results.push({
          request: i + 1,
          error: "No healthy instances available",
        });
      }
    }

    this.logger.log(
      `Random demo completed for ${serviceName} with ${requests} requests`
    );
    return results;
  }

  /**
   * Demo all load balancing strategies
   */
  demoAllLoadBalancingStrategies(
    serviceName: string,
    requests: number = 5
  ): any {
    const results = {
      roundRobin: this.demoRoundRobinLoadBalancing(serviceName, requests),
      weightedRoundRobin: this.demoWeightedRoundRobinLoadBalancing(
        serviceName,
        requests
      ),
      leastConnections: this.demoLeastConnectionsLoadBalancing(
        serviceName,
        requests
      ),
      random: this.demoRandomLoadBalancing(serviceName, requests),
    };

    this.logger.log(
      `All load balancing strategies demo completed for ${serviceName}`
    );
    return results;
  }

  /**
   * Demo health check simulation
   */
  simulateHealthCheckFailure(serviceName: string, instanceId: string): void {
    this.loadBalancer.updateInstanceMetrics(instanceId, {
      health: "unhealthy",
      lastHealthCheck: new Date(),
      responseTime: 5000,
    });

    this.logger.log(
      `Simulated health check failure for ${instanceId} in ${serviceName}`
    );
  }

  /**
   * Demo health check recovery
   */
  simulateHealthCheckRecovery(serviceName: string, instanceId: string): void {
    this.loadBalancer.updateInstanceMetrics(instanceId, {
      health: "healthy",
      lastHealthCheck: new Date(),
      responseTime: 50,
    });

    this.logger.log(
      `Simulated health check recovery for ${instanceId} in ${serviceName}`
    );
  }

  /**
   * Demo load balancer statistics
   */
  getLoadBalancerStatistics(): any {
    const statistics = this.loadBalancer.getStatistics();
    const allInstances = this.loadBalancer.getAllServiceInstances();

    return {
      statistics,
      instances: Object.fromEntries(allInstances),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Demo service instance management
   */
  addDemoInstance(serviceName: string, instance: ServiceInstance): void {
    const existingInstances =
      this.loadBalancer.getServiceInstances(serviceName);
    const updatedInstances = [...existingInstances, instance];

    this.loadBalancer.registerServiceInstances(serviceName, updatedInstances);
    this.logger.log(`Added demo instance ${instance.id} to ${serviceName}`);
  }

  /**
   * Demo service instance removal
   */
  removeDemoInstance(serviceName: string, instanceId: string): void {
    const existingInstances =
      this.loadBalancer.getServiceInstances(serviceName);
    const updatedInstances = existingInstances.filter(
      (inst) => inst.id !== instanceId
    );

    this.loadBalancer.registerServiceInstances(serviceName, updatedInstances);
    this.logger.log(`Removed demo instance ${instanceId} from ${serviceName}`);
  }

  /**
   * Demo load balancer performance test
   */
  performanceTest(serviceName: string, requests: number = 100): any {
    const startTime = Date.now();
    const results = {
      totalRequests: requests,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      strategyResults: {} as any,
    };

    const strategies = [
      "round-robin",
      "weighted-round-robin",
      "least-connections",
      "random",
    ];

    for (const strategyName of strategies) {
      const strategyStartTime = Date.now();
      const strategy = this.loadBalancer.getStrategy(strategyName);
      let successful = 0;
      let failed = 0;
      let totalResponseTime = 0;

      for (let i = 0; i < requests; i++) {
        const instance = this.loadBalancer.selectInstance(
          serviceName,
          strategy
        );
        if (instance) {
          successful++;
          totalResponseTime += instance.responseTime;
        } else {
          failed++;
        }
      }

      const strategyEndTime = Date.now();
      results.strategyResults[strategyName] = {
        successfulRequests: successful,
        failedRequests: failed,
        averageResponseTime:
          successful > 0 ? totalResponseTime / successful : 0,
        executionTime: strategyEndTime - strategyStartTime,
      };
    }

    const endTime = Date.now();
    const strategyResultsArray = Object.values(
      results.strategyResults
    ) as any[];
    results.successfulRequests = strategyResultsArray.reduce(
      (sum: number, result: any) => sum + (result.successfulRequests || 0),
      0
    );
    results.failedRequests = strategyResultsArray.reduce(
      (sum: number, result: any) => sum + (result.failedRequests || 0),
      0
    );
    results.averageResponseTime =
      results.successfulRequests > 0
        ? strategyResultsArray.reduce(
            (sum: number, result: any) =>
              sum + (result.averageResponseTime || 0),
            0
          ) / strategies.length
        : 0;

    this.logger.log(
      `Performance test completed for ${serviceName} in ${endTime - startTime}ms`
    );
    return results;
  }
}
