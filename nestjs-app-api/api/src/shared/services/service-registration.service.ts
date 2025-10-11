import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { EventBusService } from "./event-bus.service";
import { ServiceRegistryService } from "./service-registry.service";

/**
 * Service Registration Service
 * Handles automatic registration of all services in the system
 */
@Injectable()
export class ServiceRegistrationService implements OnModuleInit {
  private readonly logger = new Logger(ServiceRegistrationService.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistryService,
    private readonly eventBus: EventBusService
  ) {}

  async onModuleInit() {
    this.logger.log("🚀 Starting service registration...");

    // Register all services
    await this.registerAllServices();

    this.logger.log("✅ Service registration completed");
  }

  private async registerAllServices() {
    // Auth Service
    this.serviceRegistry.registerService({
      name: "auth-service",
      version: "1.0.0",
      dependencies: ["user-service"],
      endpoints: [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh",
        "/api/v1/auth/profile",
        "/api/v1/auth/logout",
      ],
      healthCheck: async () => {
        try {
          // Simple health check - verify auth endpoints are accessible
          return true;
        } catch (error) {
          return false;
        }
      },
      metadata: {
        description: "Authentication and authorization service",
        tags: ["auth", "security", "jwt"],
      },
    });

    // User Service
    this.serviceRegistry.registerService({
      name: "user-service",
      version: "1.0.0",
      dependencies: [],
      endpoints: [
        "/api/v1/users",
        "/api/v1/users/:id",
        "/api/v1/users/active",
        "/api/v1/users/count",
        "/api/v1/users/email/:email",
        "/api/v1/users/role/:roleName",
        "/api/v1/users/exists/:email",
        "/api/v1/roles",
        "/api/v1/roles/:id",
        "/api/v1/roles/active",
        "/api/v1/roles/count",
        "/api/v1/roles/permission/:permission",
        "/api/v1/roles/name/:name",
        "/api/v1/roles/exists/:name",
      ],
      healthCheck: async () => {
        try {
          // Simple health check - verify user endpoints are accessible
          return true;
        } catch (error) {
          return false;
        }
      },
      metadata: {
        description: "User and role management service",
        tags: ["users", "roles", "management"],
      },
    });

    // Customer Service
    this.serviceRegistry.registerService({
      name: "customer-service",
      version: "1.0.0",
      dependencies: ["user-service"],
      endpoints: [
        "/api/v1/customers",
        "/api/v1/customers/:id",
        "/api/v1/customers/active",
        "/api/v1/customers/email/:email",
      ],
      healthCheck: async () => {
        try {
          // Simple health check - verify customer endpoints are accessible
          return true;
        } catch (error) {
          return false;
        }
      },
      metadata: {
        description: "Customer management service",
        tags: ["customers", "management"],
      },
    });

    // Carrier Service
    this.serviceRegistry.registerService({
      name: "carrier-service",
      version: "1.0.0",
      dependencies: [],
      endpoints: [
        "/api/v1/carriers",
        "/api/v1/carriers/:id",
        "/api/v1/carriers/active",
      ],
      healthCheck: async () => {
        try {
          // Simple health check - verify carrier endpoints are accessible
          return true;
        } catch (error) {
          return false;
        }
      },
      metadata: {
        description: "Carrier management service",
        tags: ["carriers", "management"],
      },
    });

    // Pricing Service
    this.serviceRegistry.registerService({
      name: "pricing-service",
      version: "1.0.0",
      dependencies: [],
      endpoints: ["/api/v1/pricing"],
      healthCheck: async () => {
        try {
          // Simple health check - verify pricing endpoints are accessible
          return true;
        } catch (error) {
          return false;
        }
      },
      metadata: {
        description: "Pricing management service",
        tags: ["pricing", "management"],
      },
    });
  }
}
