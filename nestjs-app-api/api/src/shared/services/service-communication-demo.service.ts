import { Injectable, Logger } from "@nestjs/common";
import { InterServiceAuthService } from "./inter-service-auth.service";
import { LoadBalancerService, ServiceInstance } from "./load-balancer.service";
import { ServiceCommunicationService } from "./service-communication.service";

/**
 * Service Communication Demo Service
 * Demonstrates advanced service communication patterns
 */
@Injectable()
export class ServiceCommunicationDemoService {
  private readonly logger = new Logger(ServiceCommunicationDemoService.name);

  constructor(
    private readonly serviceCommunication: ServiceCommunicationService,
    private readonly loadBalancer: LoadBalancerService,
    private readonly interServiceAuth: InterServiceAuthService
  ) {}

  /**
   * Demonstrate service-to-service communication with resilience
   */
  async demonstrateServiceCommunication(): Promise<void> {
    this.logger.log("🚀 Starting Service Communication Demo");

    try {
      // 1. Demonstrate HTTP-based service communication
      await this.demonstrateHttpCommunication();

      // 2. Demonstrate load balancing
      await this.demonstrateLoadBalancing();

      // 3. Demonstrate inter-service authentication
      await this.demonstrateInterServiceAuth();

      // 4. Demonstrate circuit breaker patterns
      await this.demonstrateCircuitBreakers();

      this.logger.log("✅ Service Communication Demo completed successfully");
    } catch (error) {
      this.logger.error("❌ Service Communication Demo failed:", error);
    }
  }

  /**
   * Demonstrate HTTP-based service communication
   */
  private async demonstrateHttpCommunication(): Promise<void> {
    this.logger.log("📡 Demonstrating HTTP Service Communication");

    try {
      // Get typed service clients
      const authClient = this.serviceCommunication.getAuthServiceClient();
      const userClient = this.serviceCommunication.getUserServiceClient();

      // Demonstrate service client usage
      this.logger.debug("Using Auth Service Client...");
      if (await authClient.waitForAvailability(5000)) {
        this.logger.debug("Auth service is available");
      }

      this.logger.debug("Using User Service Client...");
      if (await userClient.waitForAvailability(5000)) {
        this.logger.debug("User service is available");

        // Try to get users with retry logic
        try {
          const users = await userClient.getUsers();
          this.logger.debug(`Retrieved ${users?.data?.length || 0} users`);
        } catch (error) {
          this.logger.warn("Failed to retrieve users:", error.message);
        }
      }

      this.logger.log("✅ HTTP Service Communication demo completed");
    } catch (error) {
      this.logger.error("❌ HTTP Service Communication demo failed:", error);
    }
  }

  /**
   * Demonstrate load balancing
   */
  private async demonstrateLoadBalancing(): Promise<void> {
    this.logger.log("⚖️ Demonstrating Load Balancing");

    try {
      // Register mock service instances
      const userServiceInstances: ServiceInstance[] = [
        {
          id: "user-service-1",
          url: "http://localhost:3001/api/v1/users",
          weight: 1,
          health: "healthy",
          lastHealthCheck: new Date(),
          responseTime: 100,
          activeConnections: 5,
        },
        {
          id: "user-service-2",
          url: "http://localhost:3002/api/v1/users",
          weight: 2,
          health: "healthy",
          lastHealthCheck: new Date(),
          responseTime: 150,
          activeConnections: 3,
        },
        {
          id: "user-service-3",
          url: "http://localhost:3003/api/v1/users",
          weight: 1,
          health: "unhealthy",
          lastHealthCheck: new Date(),
          responseTime: 5000,
          activeConnections: 0,
        },
      ];

      this.loadBalancer.registerServiceInstances(
        "user-service",
        userServiceInstances
      );

      // Demonstrate different load balancing strategies
      const strategies = [
        "round-robin",
        "weighted-round-robin",
        "least-connections",
        "random",
      ];

      for (const strategyName of strategies) {
        const strategy = this.loadBalancer.getStrategy(strategyName);
        const instance = this.loadBalancer.selectInstance(
          "user-service",
          strategy
        );

        if (instance) {
          this.logger.debug(
            `${strategyName}: Selected instance ${instance.id} (${instance.health})`
          );
        } else {
          this.logger.warn(`${strategyName}: No healthy instances available`);
        }
      }

      // Get load balancer statistics
      const stats = this.loadBalancer.getStatistics();
      this.logger.debug("Load Balancer Statistics:", stats);

      this.logger.log("✅ Load Balancing demo completed");
    } catch (error) {
      this.logger.error("❌ Load Balancing demo failed:", error);
    }
  }

  /**
   * Demonstrate inter-service authentication
   */
  private async demonstrateInterServiceAuth(): Promise<void> {
    this.logger.log("🔐 Demonstrating Inter-Service Authentication");

    try {
      // Get service credentials
      const authCredentials =
        this.interServiceAuth.getServiceCredentials("auth-service");
      const userCredentials =
        this.interServiceAuth.getServiceCredentials("user-service");

      if (authCredentials && userCredentials) {
        // Authenticate services
        const authToken = await this.interServiceAuth.authenticateService(
          authCredentials.serviceName,
          authCredentials.serviceId,
          authCredentials.secret
        );

        const userToken = await this.interServiceAuth.authenticateService(
          userCredentials.serviceName,
          userCredentials.serviceId,
          userCredentials.secret
        );

        this.logger.debug("Generated service tokens successfully");

        // Validate tokens
        const authPayload =
          await this.interServiceAuth.validateServiceToken(authToken);
        const userPayload =
          await this.interServiceAuth.validateServiceToken(userToken);

        if (authPayload && userPayload) {
          this.logger.debug(
            `Auth service permissions: ${authPayload.permissions.join(", ")}`
          );
          this.logger.debug(
            `User service permissions: ${userPayload.permissions.join(", ")}`
          );

          // Check permissions
          const canManageUsers = await this.interServiceAuth.hasPermission(
            authToken,
            "user:manage"
          );
          const canAccessAuth = await this.interServiceAuth.canAccessService(
            userToken,
            "auth-service"
          );

          this.logger.debug(`Auth service can manage users: ${canManageUsers}`);
          this.logger.debug(
            `User service can access auth service: ${canAccessAuth}`
          );
        }

        // Get authentication statistics
        const authStats = this.interServiceAuth.getAuthStatistics();
        this.logger.debug("Authentication Statistics:", authStats);
      }

      this.logger.log("✅ Inter-Service Authentication demo completed");
    } catch (error) {
      this.logger.error("❌ Inter-Service Authentication demo failed:", error);
    }
  }

  /**
   * Demonstrate circuit breaker patterns
   */
  private async demonstrateCircuitBreakers(): Promise<void> {
    this.logger.log("🔌 Demonstrating Circuit Breaker Patterns");

    try {
      // Get circuit breaker status
      const circuitBreakerStatus =
        this.serviceCommunication.getCircuitBreakerStatus();
      this.logger.debug("Circuit Breaker Status:", circuitBreakerStatus);

      // Simulate some service calls that might trigger circuit breakers
      const userClient = this.serviceCommunication.getUserServiceClient();

      if (await userClient.waitForAvailability(2000)) {
        // Try multiple calls to potentially trigger circuit breaker
        for (let i = 0; i < 3; i++) {
          try {
            await userClient.getUsers();
            this.logger.debug(`Service call ${i + 1} succeeded`);
          } catch (error) {
            this.logger.debug(`Service call ${i + 1} failed: ${error.message}`);
          }
        }
      }

      // Check circuit breaker status again
      const updatedStatus = this.serviceCommunication.getCircuitBreakerStatus();
      this.logger.debug("Updated Circuit Breaker Status:", updatedStatus);

      this.logger.log("✅ Circuit Breaker Patterns demo completed");
    } catch (error) {
      this.logger.error("❌ Circuit Breaker Patterns demo failed:", error);
    }
  }

  /**
   * Get comprehensive demo statistics
   */
  getDemoStatistics(): {
    serviceCommunication: any;
    loadBalancer: any;
    interServiceAuth: any;
    circuitBreakers: any;
  } {
    return {
      serviceCommunication: this.serviceCommunication.getStatistics(),
      loadBalancer: this.loadBalancer.getStatistics(),
      interServiceAuth: this.interServiceAuth.getAuthStatistics(),
      circuitBreakers: this.serviceCommunication.getCircuitBreakerStatus(),
    };
  }
}
