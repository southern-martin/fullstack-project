import { Controller, Get, Param } from "@nestjs/common";
import { EventBusService } from "../shared/services/event-bus.service";
import { HealthCheckService } from "../shared/services/health-check.service";
import { ServiceCommunicationService } from "../shared/services/service-communication.service";
import { ServiceRegistryService } from "../shared/services/service-registry.service";

/**
 * Health Controller
 * Provides health check endpoints for the microservice-oriented system
 */
@Controller("health")
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly serviceRegistry: ServiceRegistryService,
    private readonly eventBus: EventBusService,
    private readonly serviceCommunication: ServiceCommunicationService
  ) {}

  /**
   * Get overall system health
   */
  @Get()
  async getHealth() {
    return await this.healthCheckService.getSystemHealth();
  }

  /**
   * Get detailed health information
   */
  @Get("detailed")
  async getDetailedHealth() {
    return await this.healthCheckService.getDetailedHealth();
  }

  /**
   * Get health for a specific service
   */
  @Get("service/:serviceName")
  async getServiceHealth(@Param("serviceName") serviceName: string) {
    return await this.healthCheckService.getServiceHealth(serviceName);
  }

  /**
   * Get all registered services
   */
  @Get("services")
  async getServices() {
    const services = this.serviceRegistry.getAllServices();
    return {
      services: services.map((service) => ({
        name: service.name,
        version: service.version,
        dependencies: service.dependencies,
        endpoints: service.endpoints,
        metadata: service.metadata,
      })),
      count: services.length,
    };
  }

  /**
   * Get service registry statistics
   */
  @Get("registry/stats")
  async getRegistryStats() {
    return this.serviceRegistry.getStatistics();
  }

  /**
   * Get event bus status
   */
  @Get("events/status")
  async getEventBusStatus() {
    return this.eventBus.getStatus();
  }

  /**
   * Get event bus statistics
   */
  @Get("events/stats")
  async getEventBusStats() {
    return this.eventBus.getStatistics();
  }

  /**
   * Get service communication statistics
   */
  @Get("communication/stats")
  async getCommunicationStats() {
    return this.serviceCommunication.getStatistics();
  }

  /**
   * Get event history
   */
  @Get("events/history")
  async getEventHistory() {
    return this.eventBus.getEventHistory(50); // Last 50 events
  }

  /**
   * Simple liveness probe
   */
  @Get("live")
  async getLiveness() {
    return {
      status: "alive",
      timestamp: new Date(),
      uptime: process.uptime(),
    };
  }

  /**
   * Simple readiness probe
   */
  @Get("ready")
  async getReadiness() {
    const systemHealth = await this.healthCheckService.getSystemHealth();
    return {
      status: systemHealth.status === "healthy" ? "ready" : "not-ready",
      timestamp: new Date(),
      services: systemHealth.services.length,
      healthy: systemHealth.services.filter((s) => s.status === "healthy")
        .length,
    };
  }
}
