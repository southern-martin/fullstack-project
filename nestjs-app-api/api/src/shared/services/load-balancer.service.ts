import { Injectable, Logger } from "@nestjs/common";
import { ServiceRegistryService } from "./service-registry.service";

export interface LoadBalancingStrategy {
  selectInstance(instances: ServiceInstance[]): ServiceInstance;
}

export interface ServiceInstance {
  id: string;
  url: string;
  weight: number;
  health: "healthy" | "unhealthy" | "unknown";
  lastHealthCheck: Date;
  responseTime: number;
  activeConnections: number;
}

export interface LoadBalancerConfig {
  strategy:
    | "round-robin"
    | "weighted-round-robin"
    | "least-connections"
    | "random";
  healthCheckInterval: number;
  healthCheckTimeout: number;
  maxRetries: number;
  circuitBreakerThreshold: number;
}

/**
 * Load Balancer Service
 * Provides load balancing between service instances
 */
@Injectable()
export class LoadBalancerService {
  private readonly logger = new Logger(LoadBalancerService.name);
  private readonly serviceInstances = new Map<string, ServiceInstance[]>();
  private readonly roundRobinCounters = new Map<string, number>();
  private readonly healthCheckIntervals = new Map<string, NodeJS.Timeout>();

  constructor(private readonly serviceRegistry: ServiceRegistryService) {}

  /**
   * Register service instances for load balancing
   */
  registerServiceInstances(
    serviceName: string,
    instances: ServiceInstance[]
  ): void {
    this.serviceInstances.set(serviceName, instances);
    this.roundRobinCounters.set(serviceName, 0);

    this.logger.debug(
      `Registered ${instances.length} instances for service: ${serviceName}`
    );

    // Start health checking
    this.startHealthChecking(serviceName);
  }

  /**
   * Get the best instance for a service using the specified strategy
   */
  selectInstance(
    serviceName: string,
    strategy: LoadBalancingStrategy
  ): ServiceInstance | null {
    const instances = this.serviceInstances.get(serviceName);
    if (!instances || instances.length === 0) {
      this.logger.warn(`No instances available for service: ${serviceName}`);
      return null;
    }

    // Filter healthy instances
    const healthyInstances = instances.filter(
      (instance) => instance.health === "healthy"
    );
    if (healthyInstances.length === 0) {
      this.logger.warn(
        `No healthy instances available for service: ${serviceName}`
      );
      return null;
    }

    return strategy.selectInstance(healthyInstances);
  }

  /**
   * Round Robin Strategy
   */
  roundRobinStrategy(): LoadBalancingStrategy {
    return {
      selectInstance: (instances: ServiceInstance[]) => {
        const serviceName = this.getServiceNameFromInstances(instances);
        const counter = this.roundRobinCounters.get(serviceName) || 0;
        const selectedIndex = counter % instances.length;

        this.roundRobinCounters.set(serviceName, counter + 1);
        return instances[selectedIndex];
      },
    };
  }

  /**
   * Weighted Round Robin Strategy
   */
  weightedRoundRobinStrategy(): LoadBalancingStrategy {
    return {
      selectInstance: (instances: ServiceInstance[]) => {
        const totalWeight = instances.reduce(
          (sum, instance) => sum + instance.weight,
          0
        );
        let random = Math.random() * totalWeight;

        for (const instance of instances) {
          random -= instance.weight;
          if (random <= 0) {
            return instance;
          }
        }

        return instances[0]; // Fallback
      },
    };
  }

  /**
   * Least Connections Strategy
   */
  leastConnectionsStrategy(): LoadBalancingStrategy {
    return {
      selectInstance: (instances: ServiceInstance[]) => {
        return instances.reduce((least, current) =>
          current.activeConnections < least.activeConnections ? current : least
        );
      },
    };
  }

  /**
   * Random Strategy
   */
  randomStrategy(): LoadBalancingStrategy {
    return {
      selectInstance: (instances: ServiceInstance[]) => {
        const randomIndex = Math.floor(Math.random() * instances.length);
        return instances[randomIndex];
      },
    };
  }

  /**
   * Get strategy by name
   */
  getStrategy(strategyName: string): LoadBalancingStrategy {
    switch (strategyName) {
      case "round-robin":
        return this.roundRobinStrategy();
      case "weighted-round-robin":
        return this.weightedRoundRobinStrategy();
      case "least-connections":
        return this.leastConnectionsStrategy();
      case "random":
        return this.randomStrategy();
      default:
        this.logger.warn(
          `Unknown strategy: ${strategyName}, using round-robin`
        );
        return this.roundRobinStrategy();
    }
  }

  /**
   * Start health checking for a service
   */
  private startHealthChecking(serviceName: string): void {
    const interval = setInterval(async () => {
      await this.performHealthCheck(serviceName);
    }, 30000); // Check every 30 seconds

    this.healthCheckIntervals.set(serviceName, interval);
    this.logger.debug(`Started health checking for service: ${serviceName}`);
  }

  /**
   * Perform health check for all instances of a service
   */
  private async performHealthCheck(serviceName: string): Promise<void> {
    const instances = this.serviceInstances.get(serviceName);
    if (!instances) return;

    const healthCheckPromises = instances.map((instance) =>
      this.checkInstanceHealth(instance)
    );

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Check health of a single instance
   */
  private async checkInstanceHealth(instance: ServiceInstance): Promise<void> {
    try {
      const startTime = Date.now();

      // In a real implementation, this would make an HTTP request to the health endpoint
      // For now, we'll simulate based on the service registry
      const service = this.serviceRegistry.getService(
        this.getServiceNameFromInstance(instance)
      );
      const isHealthy = service && service.instance != null;

      const responseTime = Date.now() - startTime;

      instance.health = isHealthy ? "healthy" : "unhealthy";
      instance.lastHealthCheck = new Date();
      instance.responseTime = responseTime;

      this.logger.debug(
        `Health check for ${instance.id}: ${instance.health} (${responseTime}ms)`
      );
    } catch (error) {
      instance.health = "unhealthy";
      instance.lastHealthCheck = new Date();
      this.logger.error(`Health check failed for ${instance.id}:`, error);
    }
  }

  /**
   * Update instance metrics
   */
  updateInstanceMetrics(
    instanceId: string,
    metrics: Partial<ServiceInstance>
  ): void {
    for (const [serviceName, instances] of this.serviceInstances.entries()) {
      const instance = instances.find((inst) => inst.id === instanceId);
      if (instance) {
        Object.assign(instance, metrics);
        this.logger.debug(`Updated metrics for instance: ${instanceId}`);
        break;
      }
    }
  }

  /**
   * Get service instances
   */
  getServiceInstances(serviceName: string): ServiceInstance[] {
    return this.serviceInstances.get(serviceName) || [];
  }

  /**
   * Get all service instances
   */
  getAllServiceInstances(): Map<string, ServiceInstance[]> {
    return new Map(this.serviceInstances);
  }

  /**
   * Get load balancer statistics
   */
  getStatistics(): {
    totalServices: number;
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
    services: Record<
      string,
      {
        totalInstances: number;
        healthyInstances: number;
        averageResponseTime: number;
      }
    >;
  } {
    const services: Record<string, any> = {};
    let totalInstances = 0;
    let healthyInstances = 0;
    let unhealthyInstances = 0;

    for (const [serviceName, instances] of this.serviceInstances.entries()) {
      const healthy = instances.filter(
        (inst) => inst.health === "healthy"
      ).length;
      const unhealthy = instances.filter(
        (inst) => inst.health === "unhealthy"
      ).length;
      const avgResponseTime =
        instances.reduce((sum, inst) => sum + inst.responseTime, 0) /
        instances.length;

      services[serviceName] = {
        totalInstances: instances.length,
        healthyInstances: healthy,
        averageResponseTime: avgResponseTime || 0,
      };

      totalInstances += instances.length;
      healthyInstances += healthy;
      unhealthyInstances += unhealthy;
    }

    return {
      totalServices: this.serviceInstances.size,
      totalInstances,
      healthyInstances,
      unhealthyInstances,
      services,
    };
  }

  /**
   * Stop health checking for a service
   */
  stopHealthChecking(serviceName: string): void {
    const interval = this.healthCheckIntervals.get(serviceName);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(serviceName);
      this.logger.debug(`Stopped health checking for service: ${serviceName}`);
    }
  }

  /**
   * Stop all health checking
   */
  stopAllHealthChecking(): void {
    for (const [serviceName, interval] of this.healthCheckIntervals.entries()) {
      clearInterval(interval);
      this.logger.debug(`Stopped health checking for service: ${serviceName}`);
    }
    this.healthCheckIntervals.clear();
  }

  /**
   * Helper method to get service name from instances
   */
  private getServiceNameFromInstances(instances: ServiceInstance[]): string {
    // This is a simplified approach - in real implementation, you'd have better mapping
    for (const [
      serviceName,
      serviceInstances,
    ] of this.serviceInstances.entries()) {
      if (serviceInstances === instances) {
        return serviceName;
      }
    }
    return "unknown";
  }

  /**
   * Helper method to get service name from instance
   */
  private getServiceNameFromInstance(instance: ServiceInstance): string {
    for (const [serviceName, instances] of this.serviceInstances.entries()) {
      if (instances.includes(instance)) {
        return serviceName;
      }
    }
    return "unknown";
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    this.stopAllHealthChecking();
  }
}
