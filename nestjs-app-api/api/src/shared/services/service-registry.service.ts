import { Injectable, Logger } from "@nestjs/common";
import {
  ServiceDefinition,
  ServiceHealthStatus,
  SystemHealthStatus,
} from "../interfaces/service.interface";

/**
 * Service Registry Service
 * Manages service registration, discovery, and health monitoring
 */
@Injectable()
export class ServiceRegistryService {
  private readonly logger = new Logger(ServiceRegistryService.name);
  private readonly services = new Map<string, ServiceDefinition>();
  private readonly serviceStartTimes = new Map<string, Date>();

  /**
   * Register a service with the registry
   */
  registerService(service: ServiceDefinition): void {
    try {
      // Validate service definition
      this.validateServiceDefinition(service);

      // Register service
      this.services.set(service.name, service);
      this.serviceStartTimes.set(service.name, new Date());

      this.logger.log(
        `✅ Service registered: ${service.name} v${service.version}`
      );
      this.logger.debug(`Service endpoints: ${service.endpoints.join(", ")}`);

      if (service.dependencies.length > 0) {
        this.logger.debug(
          `Service dependencies: ${service.dependencies.join(", ")}`
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to register service ${service.name}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Unregister a service from the registry
   */
  unregisterService(serviceName: string): void {
    if (this.services.has(serviceName)) {
      this.services.delete(serviceName);
      this.serviceStartTimes.delete(serviceName);
      this.logger.log(`🗑️ Service unregistered: ${serviceName}`);
    } else {
      this.logger.warn(
        `⚠️ Attempted to unregister unknown service: ${serviceName}`
      );
    }
  }

  /**
   * Get a service by name
   */
  getService(serviceName: string): ServiceDefinition | undefined {
    return this.services.get(serviceName);
  }

  /**
   * Get all registered services
   */
  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }

  /**
   * Get services by dependency
   */
  getServicesByDependency(dependencyName: string): ServiceDefinition[] {
    return this.getAllServices().filter((service) =>
      service.dependencies.includes(dependencyName)
    );
  }

  /**
   * Check if a service is registered
   */
  isServiceRegistered(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Get service count
   */
  getServiceCount(): number {
    return this.services.size;
  }

  /**
   * Perform health check on all services
   */
  async performHealthCheck(): Promise<SystemHealthStatus> {
    const services = this.getAllServices();
    const serviceHealthPromises = services.map((service) =>
      this.checkServiceHealth(service)
    );

    const serviceHealthResults = await Promise.allSettled(
      serviceHealthPromises
    );
    const serviceHealthStatuses: ServiceHealthStatus[] = [];

    serviceHealthResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        serviceHealthStatuses.push(result.value);
      } else {
        const service = services[index];
        serviceHealthStatuses.push({
          name: service.name,
          status: "unhealthy",
          timestamp: new Date(),
          dependencies: service.dependencies,
          details: {
            error: result.reason?.message || "Unknown error",
          },
        });
      }
    });

    const healthyServices = serviceHealthStatuses.filter(
      (s) => s.status === "healthy"
    ).length;
    const unhealthyServices = serviceHealthStatuses.filter(
      (s) => s.status === "unhealthy"
    ).length;

    let overallStatus: "healthy" | "unhealthy" | "degraded";
    if (unhealthyServices === 0) {
      overallStatus = "healthy";
    } else if (healthyServices > 0) {
      overallStatus = "degraded";
    } else {
      overallStatus = "unhealthy";
    }

    return {
      status: overallStatus,
      services: serviceHealthStatuses,
      timestamp: new Date(),
      metadata: {
        totalServices: services.length,
        healthyServices,
        unhealthyServices,
      },
    };
  }

  /**
   * Check health of a specific service
   */
  private async checkServiceHealth(
    service: ServiceDefinition
  ): Promise<ServiceHealthStatus> {
    try {
      const isHealthy = await service.healthCheck();
      const startTime = this.serviceStartTimes.get(service.name);
      const uptime = startTime ? Date.now() - startTime.getTime() : 0;

      return {
        name: service.name,
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date(),
        dependencies: service.dependencies,
        details: {
          uptime,
          version: service.version,
        },
      };
    } catch (error) {
      this.logger.error(
        `Health check failed for service ${service.name}:`,
        error
      );
      return {
        name: service.name,
        status: "unhealthy",
        timestamp: new Date(),
        dependencies: service.dependencies,
        details: {
          error: error.message,
        },
      };
    }
  }

  /**
   * Validate service definition
   */
  private validateServiceDefinition(service: ServiceDefinition): void {
    if (!service.name || typeof service.name !== "string") {
      throw new Error("Service name is required and must be a string");
    }

    if (!service.version || typeof service.version !== "string") {
      throw new Error("Service version is required and must be a string");
    }

    if (!Array.isArray(service.dependencies)) {
      throw new Error("Service dependencies must be an array");
    }

    if (!Array.isArray(service.endpoints)) {
      throw new Error("Service endpoints must be an array");
    }

    if (typeof service.healthCheck !== "function") {
      throw new Error("Service healthCheck must be a function");
    }

    // Check for duplicate service names
    if (this.services.has(service.name)) {
      throw new Error(
        `Service with name '${service.name}' is already registered`
      );
    }
  }

  /**
   * Get service registry statistics
   */
  getStatistics(): {
    totalServices: number;
    services: Array<{
      name: string;
      version: string;
      dependencies: number;
      endpoints: number;
      uptime: number;
    }>;
  } {
    const services = this.getAllServices();
    const now = Date.now();

    return {
      totalServices: services.length,
      services: services.map((service) => {
        const startTime = this.serviceStartTimes.get(service.name);
        const uptime = startTime ? now - startTime.getTime() : 0;

        return {
          name: service.name,
          version: service.version,
          dependencies: service.dependencies.length,
          endpoints: service.endpoints.length,
          uptime,
        };
      }),
    };
  }
}
