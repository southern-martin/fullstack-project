import { Injectable, Logger } from "@nestjs/common";
import { HttpClientService, ServiceCallOptions } from "./http-client.service";
import { ServiceRegistryService } from "./service-registry.service";

export interface ServiceClientConfig {
  serviceName: string;
  baseEndpoint?: string;
  defaultOptions?: ServiceCallOptions;
}

/**
 * Service Client Factory
 * Creates typed service clients for easy service-to-service communication
 */
@Injectable()
export class ServiceClientFactory {
  private readonly logger = new Logger(ServiceClientFactory.name);

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly serviceRegistry: ServiceRegistryService
  ) {}

  /**
   * Create a service client for a specific service
   */
  createServiceClient<T = any>(config: ServiceClientConfig): ServiceClient<T> {
    return new ServiceClient<T>(
      config.serviceName,
      config.baseEndpoint || "",
      config.defaultOptions || {},
      this.httpClient,
      this.serviceRegistry
    );
  }

  /**
   * Create Auth Service client
   */
  createAuthServiceClient(): AuthServiceClient {
    return new AuthServiceClient(
      "auth-service",
      "auth",
      {},
      this.httpClient,
      this.serviceRegistry
    );
  }

  /**
   * Create User Service client
   */
  createUserServiceClient(): UserServiceClient {
    return new UserServiceClient(
      "user-service",
      "users",
      {},
      this.httpClient,
      this.serviceRegistry
    );
  }

  /**
   * Create Customer Service client
   */
  createCustomerServiceClient(): CustomerServiceClient {
    return new CustomerServiceClient(
      "customer-service",
      "customers",
      {},
      this.httpClient,
      this.serviceRegistry
    );
  }

  /**
   * Create Carrier Service client
   */
  createCarrierServiceClient(): CarrierServiceClient {
    return new CarrierServiceClient(
      "carrier-service",
      "carriers",
      {},
      this.httpClient,
      this.serviceRegistry
    );
  }

  /**
   * Create Pricing Service client
   */
  createPricingServiceClient(): PricingServiceClient {
    return new PricingServiceClient(
      "pricing-service",
      "pricing",
      {},
      this.httpClient,
      this.serviceRegistry
    );
  }
}

/**
 * Generic Service Client
 */
export class ServiceClient<T = any> {
  private readonly logger = new Logger(ServiceClient.name);

  constructor(
    private readonly serviceName: string,
    private readonly baseEndpoint: string,
    private readonly defaultOptions: ServiceCallOptions,
    private readonly httpClient: HttpClientService,
    private readonly serviceRegistry: ServiceRegistryService
  ) {}

  /**
   * Call a service endpoint
   */
  async call<R = T>(
    endpoint: string,
    data?: any,
    options: ServiceCallOptions = {}
  ): Promise<R> {
    const fullEndpoint = this.buildEndpoint(endpoint);
    const mergedOptions = { ...this.defaultOptions, ...options };

    return await this.httpClient.callServiceEndpoint<R>(
      this.serviceName,
      fullEndpoint,
      data,
      mergedOptions
    );
  }

  /**
   * GET request
   */
  async get<R = T>(endpoint: string, options?: ServiceCallOptions): Promise<R> {
    return await this.call<R>(endpoint, undefined, options);
  }

  /**
   * POST request
   */
  async post<R = T>(
    endpoint: string,
    data?: any,
    options?: ServiceCallOptions
  ): Promise<R> {
    return await this.call<R>(endpoint, data, options);
  }

  /**
   * PUT request
   */
  async put<R = T>(
    endpoint: string,
    data?: any,
    options?: ServiceCallOptions
  ): Promise<R> {
    return await this.call<R>(endpoint, data, options);
  }

  /**
   * PATCH request
   */
  async patch<R = T>(
    endpoint: string,
    data?: any,
    options?: ServiceCallOptions
  ): Promise<R> {
    return await this.call<R>(endpoint, data, options);
  }

  /**
   * DELETE request
   */
  async delete<R = T>(
    endpoint: string,
    options?: ServiceCallOptions
  ): Promise<R> {
    return await this.call<R>(endpoint, undefined, options);
  }

  /**
   * Build full endpoint path
   */
  private buildEndpoint(endpoint: string): string {
    if (this.baseEndpoint) {
      return `${this.baseEndpoint}/${endpoint}`;
    }
    return endpoint;
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return this.serviceRegistry.getService(this.serviceName)?.instance != null;
  }

  /**
   * Wait for service to become available
   */
  async waitForAvailability(timeout: number = 10000): Promise<boolean> {
    const startTime = Date.now();
    const interval = 1000;

    while (Date.now() - startTime < timeout) {
      if (this.isAvailable()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    return false;
  }
}

/**
 * Auth Service Client
 */
export class AuthServiceClient extends ServiceClient {
  async login(credentials: { email: string; password: string }) {
    return await this.post("login", credentials);
  }

  async register(userData: any) {
    return await this.post("register", userData);
  }

  async refreshToken(token: string) {
    return await this.post("refresh", { token });
  }

  async getProfile(token: string) {
    return await this.get("profile", {
      timeout: 5000,
      retry: {
        maxRetries: 2,
        retryDelay: 500,
        backoffMultiplier: 2,
        maxRetryDelay: 2000,
      },
    });
  }

  async logout(token: string) {
    return await this.post("logout", { token });
  }
}

/**
 * User Service Client
 */
export class UserServiceClient extends ServiceClient {
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    return await this.get("", { timeout: 10000 });
  }

  async getUserById(id: number) {
    return await this.get(`${id}`, {
      retry: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        maxRetryDelay: 5000,
      },
    });
  }

  async createUser(userData: any) {
    return await this.post("", userData);
  }

  async updateUser(id: number, userData: any) {
    return await this.patch(`${id}`, userData);
  }

  async deleteUser(id: number) {
    return await this.delete(`${id}`);
  }

  async getUserByEmail(email: string) {
    return await this.get(`email/${email}`);
  }

  async getActiveUsers() {
    return await this.get("active");
  }

  async getUserCount() {
    return await this.get("count");
  }
}

/**
 * Customer Service Client
 */
export class CustomerServiceClient extends ServiceClient {
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return await this.get("", { timeout: 10000 });
  }

  async getCustomerById(id: number) {
    return await this.get(`${id}`);
  }

  async createCustomer(customerData: any) {
    return await this.post("", customerData);
  }

  async updateCustomer(id: number, customerData: any) {
    return await this.patch(`${id}`, customerData);
  }

  async deleteCustomer(id: number) {
    return await this.delete(`${id}`);
  }

  async getCustomerByEmail(email: string) {
    return await this.get(`email/${email}`);
  }

  async getActiveCustomers() {
    return await this.get("active");
  }
}

/**
 * Carrier Service Client
 */
export class CarrierServiceClient extends ServiceClient {
  async getCarriers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return await this.get("", { timeout: 10000 });
  }

  async getCarrierById(id: number) {
    return await this.get(`${id}`);
  }

  async createCarrier(carrierData: any) {
    return await this.post("", carrierData);
  }

  async updateCarrier(id: number, carrierData: any) {
    return await this.patch(`${id}`, carrierData);
  }

  async deleteCarrier(id: number) {
    return await this.delete(`${id}`);
  }

  async getActiveCarriers() {
    return await this.get("active");
  }
}

/**
 * Pricing Service Client
 */
export class PricingServiceClient extends ServiceClient {
  async getPricing(params?: any) {
    return await this.get("", { timeout: 5000 });
  }

  async calculatePrice(pricingData: any) {
    return await this.post("calculate", pricingData, {
      retry: {
        maxRetries: 2,
        retryDelay: 1000,
        backoffMultiplier: 2,
        maxRetryDelay: 3000,
      },
    });
  }

  async updatePricing(pricingData: any) {
    return await this.put("", pricingData);
  }
}
