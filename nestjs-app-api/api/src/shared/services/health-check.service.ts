import { Injectable, Logger } from "@nestjs/common";
import { SystemHealthStatus } from "../interfaces/service.interface";
import { EventBusService } from "./event-bus.service";
import { ServiceCommunicationService } from "./service-communication.service";
import { ServiceRegistryService } from "./service-registry.service";

/**
 * Health Check Service
 * Provides comprehensive health monitoring for the microservice-oriented system
 */
@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistryService,
    private readonly eventBus: EventBusService,
    private readonly serviceCommunication: ServiceCommunicationService
  ) {}

  /**
   * Get overall system health
   */
  async getSystemHealth(): Promise<SystemHealthStatus> {
    try {
      this.logger.debug("Performing system health check");

      // Get service health from registry
      const systemHealth = await this.serviceRegistry.performHealthCheck();

      // Add infrastructure health
      const infrastructureHealth = await this.checkInfrastructureHealth();

      // Update system status based on infrastructure
      if (infrastructureHealth.status === "unhealthy") {
        systemHealth.status = "degraded";
      }

      // Add infrastructure details to metadata
      systemHealth.metadata = {
        ...systemHealth.metadata,
        infrastructure: infrastructureHealth,
      };

      this.logger.debug(
        `System health check completed: ${systemHealth.status}`
      );
      return systemHealth;
    } catch (error) {
      this.logger.error("System health check failed:", error);

      return {
        status: "unhealthy",
        services: [],
        timestamp: new Date(),
        metadata: {
          error: error.message,
        },
      };
    }
  }

  /**
   * Get health check for a specific service
   */
  async getServiceHealth(serviceName: string): Promise<{
    name: string;
    status: "healthy" | "unhealthy" | "unknown";
    timestamp: Date;
    details: any;
  }> {
    try {
      const service = this.serviceRegistry.getService(serviceName);

      if (!service) {
        return {
          name: serviceName,
          status: "unknown",
          timestamp: new Date(),
          details: { error: "Service not found" },
        };
      }

      const isHealthy = await service.healthCheck();

      return {
        name: serviceName,
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date(),
        details: {
          version: service.version,
          dependencies: service.dependencies,
          endpoints: service.endpoints,
        },
      };
    } catch (error) {
      this.logger.error(
        `Health check failed for service ${serviceName}:`,
        error
      );

      return {
        name: serviceName,
        status: "unhealthy",
        timestamp: new Date(),
        details: { error: error.message },
      };
    }
  }

  /**
   * Get infrastructure health
   */
  private async checkInfrastructureHealth(): Promise<{
    status: "healthy" | "unhealthy";
    components: {
      serviceRegistry: boolean;
      eventBus: boolean;
      serviceCommunication: boolean;
    };
    details: any;
  }> {
    try {
      // Check service registry
      const registryHealthy = this.serviceRegistry.getServiceCount() >= 0;

      // Check event bus
      const eventBusStatus = this.eventBus.getStatus();
      const eventBusHealthy = eventBusStatus.isRunning;

      // Check service communication
      const commStats = this.serviceCommunication.getStatistics();
      const commHealthy = commStats.registeredServices >= 0;

      const allHealthy = registryHealthy && eventBusHealthy && commHealthy;

      return {
        status: allHealthy ? "healthy" : "unhealthy",
        components: {
          serviceRegistry: registryHealthy,
          eventBus: eventBusHealthy,
          serviceCommunication: commHealthy,
        },
        details: {
          serviceRegistry: {
            registeredServices: this.serviceRegistry.getServiceCount(),
          },
          eventBus: eventBusStatus,
          serviceCommunication: commStats,
        },
      };
    } catch (error) {
      this.logger.error("Infrastructure health check failed:", error);

      return {
        status: "unhealthy",
        components: {
          serviceRegistry: false,
          eventBus: false,
          serviceCommunication: false,
        },
        details: { error: error.message },
      };
    }
  }

  /**
   * Get detailed health information
   */
  async getDetailedHealth(): Promise<{
    system: SystemHealthStatus;
    infrastructure: any;
    services: any[];
    statistics: any;
  }> {
    try {
      const systemHealth = await this.getSystemHealth();
      const infrastructureHealth = await this.checkInfrastructureHealth();

      // Get individual service health
      const services = this.serviceRegistry.getAllServices();
      const serviceHealthPromises = services.map((service) =>
        this.getServiceHealth(service.name)
      );
      const serviceHealthResults = await Promise.allSettled(
        serviceHealthPromises
      );

      const serviceHealth = serviceHealthResults.map((result, index) => ({
        service: services[index],
        health:
          result.status === "fulfilled"
            ? result.value
            : {
                name: services[index].name,
                status: "unhealthy",
                timestamp: new Date(),
                details: {
                  error:
                    result.status === "rejected"
                      ? result.reason.message
                      : "Unknown error",
                },
              },
      }));

      // Get statistics
      const statistics = {
        serviceRegistry: this.serviceRegistry.getStatistics(),
        eventBus: this.eventBus.getStatistics(),
        serviceCommunication: this.serviceCommunication.getStatistics(),
      };

      return {
        system: systemHealth,
        infrastructure: infrastructureHealth,
        services: serviceHealth,
        statistics,
      };
    } catch (error) {
      this.logger.error("Detailed health check failed:", error);
      throw error;
    }
  }

  /**
   * Start health monitoring
   */
  async startHealthMonitoring(intervalMs: number = 30000): Promise<void> {
    this.logger.log(`Starting health monitoring with ${intervalMs}ms interval`);

    setInterval(async () => {
      try {
        const health = await this.getSystemHealth();

        if (health.status === "unhealthy") {
          this.logger.error("System health check failed:", health);
        } else if (health.status === "degraded") {
          this.logger.warn("System health is degraded:", health);
        } else {
          this.logger.debug("System health check passed");
        }
      } catch (error) {
        this.logger.error("Health monitoring error:", error);
      }
    }, intervalMs);
  }
}
