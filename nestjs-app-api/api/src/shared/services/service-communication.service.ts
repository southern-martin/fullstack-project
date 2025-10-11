import { Injectable, Logger } from "@nestjs/common";
import { BaseEvent } from "../interfaces/event.interface";
import { EventBusService } from "./event-bus.service";
import { HttpClientService, ServiceCallOptions } from "./http-client.service";
import { ServiceClientFactory } from "./service-client.factory";
import { ServiceRegistryService } from "./service-registry.service";

/**
 * Service Communication Service
 * Handles communication between services in the microservice-oriented architecture
 */
@Injectable()
export class ServiceCommunicationService {
  private readonly logger = new Logger(ServiceCommunicationService.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistryService,
    private readonly eventBus: EventBusService,
    private readonly httpClient: HttpClientService,
    private readonly serviceClientFactory: ServiceClientFactory
  ) {}

  /**
   * Call a service method synchronously
   * In microservice-oriented: direct method call
   * In true microservices: HTTP/gRPC call
   */
  async callService<T>(
    serviceName: string,
    method: string,
    params: any[] = []
  ): Promise<T> {
    try {
      const service = this.serviceRegistry.getService(serviceName);

      if (!service) {
        throw new Error(`Service '${serviceName}' not found`);
      }

      if (!service.instance) {
        throw new Error(`Service '${serviceName}' instance not available`);
      }

      if (typeof service.instance[method] !== "function") {
        throw new Error(
          `Method '${method}' not found on service '${serviceName}'`
        );
      }

      this.logger.debug(`Calling service method: ${serviceName}.${method}`);

      const result = await service.instance[method](...params);

      this.logger.debug(
        `Service method call successful: ${serviceName}.${method}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Service method call failed: ${serviceName}.${method}`,
        error
      );
      throw error;
    }
  }

  /**
   * Publish an event asynchronously
   */
  async publishEvent<T extends BaseEvent>(event: T): Promise<void> {
    try {
      this.logger.debug(`Publishing event: ${event.eventType}`);
      await this.eventBus.publish(event);
      this.logger.debug(`Event published successfully: ${event.eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.eventType}`, error);
      throw error;
    }
  }

  /**
   * Request-Response pattern
   * Send a request and wait for a response
   */
  async requestResponse<TRequest, TResponse>(
    serviceName: string,
    request: TRequest,
    timeout: number = 5000
  ): Promise<TResponse> {
    try {
      this.logger.debug(`Sending request to service: ${serviceName}`);

      // For now, we'll use direct method calls
      // In true microservices, this would use HTTP/gRPC with timeout
      const result = await this.callService<TResponse>(
        serviceName,
        "handleRequest",
        [request]
      );

      this.logger.debug(`Request-Response successful: ${serviceName}`);
      return result;
    } catch (error) {
      this.logger.error(`Request-Response failed: ${serviceName}`, error);
      throw error;
    }
  }

  /**
   * Fire and forget pattern
   * Send a request without waiting for response
   */
  async fireAndForget<TRequest>(
    serviceName: string,
    request: TRequest
  ): Promise<void> {
    try {
      this.logger.debug(`Fire and forget request to service: ${serviceName}`);

      // Execute without waiting for result
      this.callService(serviceName, "handleRequest", [request]).catch(
        (error) => {
          this.logger.error(`Fire and forget failed: ${serviceName}`, error);
        }
      );
    } catch (error) {
      this.logger.error(`Fire and forget setup failed: ${serviceName}`, error);
      throw error;
    }
  }

  /**
   * Broadcast to multiple services
   */
  async broadcast<TRequest>(
    serviceNames: string[],
    request: TRequest
  ): Promise<void> {
    try {
      this.logger.debug(`Broadcasting to ${serviceNames.length} services`);

      const broadcastPromises = serviceNames.map((serviceName) =>
        this.fireAndForget(serviceName, request)
      );

      await Promise.allSettled(broadcastPromises);
      this.logger.debug(
        `Broadcast completed to ${serviceNames.length} services`
      );
    } catch (error) {
      this.logger.error("Broadcast failed", error);
      throw error;
    }
  }

  /**
   * Get service communication statistics
   */
  getStatistics(): {
    registeredServices: number;
    availableServices: string[];
    eventBusStatus: any;
  } {
    const services = this.serviceRegistry.getAllServices();
    const availableServices = services
      .filter((service) => service.instance)
      .map((service) => service.name);

    return {
      registeredServices: services.length,
      availableServices,
      eventBusStatus: this.eventBus.getStatus(),
    };
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(serviceName: string): boolean {
    const service = this.serviceRegistry.getService(serviceName);
    return service && !!service.instance;
  }

  /**
   * Get available services
   */
  getAvailableServices(): string[] {
    return this.serviceRegistry
      .getAllServices()
      .filter((service) => service.instance)
      .map((service) => service.name);
  }

  /**
   * Wait for service to become available
   */
  async waitForService(
    serviceName: string,
    timeout: number = 10000,
    interval: number = 1000
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (this.isServiceAvailable(serviceName)) {
        this.logger.debug(`Service ${serviceName} is now available`);
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    this.logger.warn(
      `Service ${serviceName} did not become available within ${timeout}ms`
    );
    return false;
  }

  /**
   * Call a service endpoint via HTTP with advanced resilience
   */
  async callServiceEndpoint<T>(
    serviceName: string,
    endpoint: string,
    data?: any,
    options: ServiceCallOptions = {}
  ): Promise<T> {
    try {
      this.logger.debug(`Calling service endpoint: ${serviceName}/${endpoint}`);

      const result = await this.httpClient.callServiceEndpoint<T>(
        serviceName,
        endpoint,
        data,
        options
      );

      this.logger.debug(
        `Service endpoint call successful: ${serviceName}/${endpoint}`
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Service endpoint call failed: ${serviceName}/${endpoint}`,
        error
      );
      throw error;
    }
  }

  /**
   * Get a typed service client
   */
  getServiceClient<T = any>(serviceName: string, baseEndpoint?: string) {
    return this.serviceClientFactory.createServiceClient<T>({
      serviceName,
      baseEndpoint,
    });
  }

  /**
   * Get Auth Service client
   */
  getAuthServiceClient() {
    return this.serviceClientFactory.createAuthServiceClient();
  }

  /**
   * Get User Service client
   */
  getUserServiceClient() {
    return this.serviceClientFactory.createUserServiceClient();
  }

  /**
   * Get Customer Service client
   */
  getCustomerServiceClient() {
    return this.serviceClientFactory.createCustomerServiceClient();
  }

  /**
   * Get Carrier Service client
   */
  getCarrierServiceClient() {
    return this.serviceClientFactory.createCarrierServiceClient();
  }

  /**
   * Get Pricing Service client
   */
  getPricingServiceClient() {
    return this.serviceClientFactory.createPricingServiceClient();
  }

  /**
   * Get circuit breaker status for all services
   */
  getCircuitBreakerStatus() {
    return this.httpClient.getCircuitBreakerStatus();
  }

  /**
   * Reset circuit breaker for a specific service endpoint
   */
  resetCircuitBreaker(serviceName: string, endpoint: string) {
    const key = `${serviceName}:${endpoint}`;
    this.httpClient.resetCircuitBreaker(key);
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers() {
    this.httpClient.resetAllCircuitBreakers();
  }
}
