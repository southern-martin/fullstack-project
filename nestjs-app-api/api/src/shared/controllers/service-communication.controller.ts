import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { InterServiceAuthService } from "../services/inter-service-auth.service";
import { LoadBalancerService } from "../services/load-balancer.service";
import { ServiceCommunicationDemoService } from "../services/service-communication-demo.service";
import { ServiceCommunicationService } from "../services/service-communication.service";

/**
 * Service Communication Controller
 * Provides endpoints to demonstrate and manage advanced service communication
 */
@Controller("service-communication")
export class ServiceCommunicationController {
  private readonly logger = new Logger(ServiceCommunicationController.name);

  constructor(
    private readonly demoService: ServiceCommunicationDemoService,
    private readonly serviceCommunication: ServiceCommunicationService,
    private readonly loadBalancer: LoadBalancerService,
    private readonly interServiceAuth: InterServiceAuthService
  ) {}

  /**
   * Run comprehensive service communication demo
   */
  @Post("demo")
  async runDemo() {
    this.logger.log("Starting Service Communication Demo via API");
    await this.demoService.demonstrateServiceCommunication();
    return {
      message: "Service Communication Demo completed",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get comprehensive service communication statistics
   */
  @Get("statistics")
  getStatistics() {
    return this.demoService.getDemoStatistics();
  }

  /**
   * Get service communication status
   */
  @Get("status")
  getStatus() {
    return {
      serviceCommunication: this.serviceCommunication.getStatistics(),
      loadBalancer: this.loadBalancer.getStatistics(),
      interServiceAuth: this.interServiceAuth.getAuthStatistics(),
      circuitBreakers: this.serviceCommunication.getCircuitBreakerStatus(),
    };
  }

  /**
   * Get available services
   */
  @Get("services")
  getAvailableServices() {
    return {
      availableServices: this.serviceCommunication.getAvailableServices(),
      registeredServices:
        this.serviceCommunication.getStatistics().registeredServices,
    };
  }

  /**
   * Test service-to-service communication
   */
  @Post("test/:serviceName/:endpoint")
  async testServiceCommunication(
    @Param("serviceName") serviceName: string,
    @Param("endpoint") endpoint: string,
    @Body() data?: any
  ) {
    try {
      const result = await this.serviceCommunication.callServiceEndpoint(
        serviceName,
        endpoint,
        data,
        {
          timeout: 10000,
          retry: {
            maxRetries: 3,
            retryDelay: 1000,
            backoffMultiplier: 2,
            maxRetryDelay: 5000,
          },
        }
      );

      return {
        success: true,
        serviceName,
        endpoint,
        result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        serviceName,
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get load balancer statistics
   */
  @Get("load-balancer/statistics")
  getLoadBalancerStatistics() {
    return this.loadBalancer.getStatistics();
  }

  /**
   * Register service instances for load balancing
   */
  @Post("load-balancer/:serviceName/instances")
  registerServiceInstances(
    @Param("serviceName") serviceName: string,
    @Body() instances: any[]
  ) {
    this.loadBalancer.registerServiceInstances(serviceName, instances);
    return {
      message: `Registered ${instances.length} instances for service: ${serviceName}`,
      serviceName,
      instanceCount: instances.length,
    };
  }

  /**
   * Test load balancing strategy
   */
  @Get("load-balancer/:serviceName/select/:strategy")
  testLoadBalancing(
    @Param("serviceName") serviceName: string,
    @Param("strategy") strategy: string
  ) {
    const loadBalancingStrategy = this.loadBalancer.getStrategy(strategy);
    const selectedInstance = this.loadBalancer.selectInstance(
      serviceName,
      loadBalancingStrategy
    );

    return {
      serviceName,
      strategy,
      selectedInstance,
      availableInstances: this.loadBalancer.getServiceInstances(serviceName),
    };
  }

  /**
   * Get inter-service authentication statistics
   */
  @Get("auth/statistics")
  getAuthStatistics() {
    return this.interServiceAuth.getAuthStatistics();
  }

  /**
   * Authenticate a service
   */
  @Post("auth/authenticate")
  async authenticateService(
    @Body()
    credentials: {
      serviceName: string;
      serviceId: string;
      secret: string;
    }
  ) {
    try {
      const token = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      return {
        success: true,
        token,
        serviceName: credentials.serviceName,
        serviceId: credentials.serviceId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        serviceName: credentials.serviceName,
      };
    }
  }

  /**
   * Validate a service token
   */
  @Post("auth/validate")
  async validateServiceToken(@Body() body: { token: string }) {
    try {
      const payload = await this.interServiceAuth.validateServiceToken(
        body.token
      );
      return {
        success: true,
        valid: !!payload,
        payload,
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Check service permissions
   */
  @Post("auth/check-permission")
  async checkPermission(@Body() body: { token: string; permission: string }) {
    try {
      const hasPermission = await this.interServiceAuth.hasPermission(
        body.token,
        body.permission
      );
      return {
        success: true,
        hasPermission,
        permission: body.permission,
      };
    } catch (error) {
      return {
        success: false,
        hasPermission: false,
        error: error.message,
      };
    }
  }

  /**
   * Get circuit breaker status
   */
  @Get("circuit-breakers")
  getCircuitBreakerStatus() {
    return this.serviceCommunication.getCircuitBreakerStatus();
  }

  /**
   * Reset circuit breaker
   */
  @Post("circuit-breakers/reset/:serviceName/:endpoint")
  resetCircuitBreaker(
    @Param("serviceName") serviceName: string,
    @Param("endpoint") endpoint: string
  ) {
    this.serviceCommunication.resetCircuitBreaker(serviceName, endpoint);
    return {
      message: `Circuit breaker reset for ${serviceName}/${endpoint}`,
      serviceName,
      endpoint,
    };
  }

  /**
   * Reset all circuit breakers
   */
  @Post("circuit-breakers/reset-all")
  resetAllCircuitBreakers() {
    this.serviceCommunication.resetAllCircuitBreakers();
    return {
      message: "All circuit breakers reset",
    };
  }

  /**
   * Get service client examples
   */
  @Get("clients/examples")
  getServiceClientExamples() {
    return {
      authClient: {
        methods: ["login", "register", "refreshToken", "getProfile", "logout"],
        example:
          "const authClient = serviceCommunication.getAuthServiceClient();",
      },
      userClient: {
        methods: [
          "getUsers",
          "getUserById",
          "createUser",
          "updateUser",
          "deleteUser",
        ],
        example:
          "const userClient = serviceCommunication.getUserServiceClient();",
      },
      customerClient: {
        methods: [
          "getCustomers",
          "getCustomerById",
          "createCustomer",
          "updateCustomer",
        ],
        example:
          "const customerClient = serviceCommunication.getCustomerServiceClient();",
      },
      carrierClient: {
        methods: [
          "getCarriers",
          "getCarrierById",
          "createCarrier",
          "updateCarrier",
        ],
        example:
          "const carrierClient = serviceCommunication.getCarrierServiceClient();",
      },
      pricingClient: {
        methods: ["getPricing", "calculatePrice", "updatePricing"],
        example:
          "const pricingClient = serviceCommunication.getPricingServiceClient();",
      },
    };
  }
}
