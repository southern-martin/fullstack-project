/**
 * Cross-Service Communication Module
 *
 * This module provides utilities for inter-service communication
 * in the hybrid database architecture where some services share
 * databases and others use separate databases.
 *
 * @deprecated Use @shared/infrastructure instead
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";

// Service configuration interface
interface ServiceConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// Service response interface
interface ServiceResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

// Service communication class
export class ServiceCommunicator {
  private services: Map<string, AxiosInstance> = new Map();
  private config: Map<string, ServiceConfig> = new Map();

  constructor() {
    this.initializeServices();
  }

  /**
   * Initialize service configurations
   */
  private initializeServices(): void {
    const serviceConfigs: Record<string, ServiceConfig> = {
      user: {
        baseURL: process.env.USER_SERVICE_URL || "http://user-service:3003",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      customer: {
        baseURL:
          process.env.CUSTOMER_SERVICE_URL || "http://customer-service:3004",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      carrier: {
        baseURL:
          process.env.CARRIER_SERVICE_URL || "http://carrier-service:3005",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      pricing: {
        baseURL:
          process.env.PRICING_SERVICE_URL || "http://pricing-service:3006",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
    };

    // Create axios instances for each service
    Object.entries(serviceConfigs).forEach(([serviceName, config]) => {
      this.config.set(serviceName, config);

      const axiosInstance = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Add request interceptor for authentication
      axiosInstance.interceptors.request.use(
        (config) => {
          // Add authentication token if available
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Add response interceptor for error handling
      axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // Retry logic for failed requests
          if (error.response?.status >= 500 && !originalRequest._retry) {
            const serviceConfig = this.config.get(serviceName);
            if (
              serviceConfig &&
              originalRequest._retryCount < serviceConfig.retries
            ) {
              originalRequest._retry = true;
              originalRequest._retryCount =
                (originalRequest._retryCount || 0) + 1;

              await this.delay(serviceConfig.retryDelay);
              return axiosInstance(originalRequest);
            }
          }

          return Promise.reject(error);
        }
      );

      this.services.set(serviceName, axiosInstance);
    });
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    // In a real implementation, this would get the token from
    // the request context, JWT, or other authentication mechanism
    return process.env.SERVICE_AUTH_TOKEN || null;
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get service instance
   */
  private getService(serviceName: string): AxiosInstance {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  /**
   * Make HTTP request to a service
   */
  private async makeRequest<T>(
    serviceName: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<ServiceResponse<T>> {
    try {
      const service = this.getService(serviceName);
      let response: AxiosResponse<T>;

      switch (method) {
        case "GET":
          response = await service.get(endpoint, { params });
          break;
        case "POST":
          response = await service.post(endpoint, data, { params });
          break;
        case "PUT":
          response = await service.put(endpoint, data, { params });
          break;
        case "PATCH":
          response = await service.patch(endpoint, data, { params });
          break;
        case "DELETE":
          response = await service.delete(endpoint, { params });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return {
        data: response.data,
        status: response.status,
        message: "Success",
      };
    } catch (error: any) {
      return {
        data: null as any,
        status: error.response?.status || 500,
        error: error.message || "Service communication error",
      };
    }
  }

  // ===========================================
  // USER SERVICE COMMUNICATION
  // ===========================================

  /**
   * Get user by ID
   */
  async getUser(userId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest("user", "GET", `/api/v1/users/${userId}`);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ServiceResponse<any>> {
    return this.makeRequest("user", "GET", `/api/v1/users/email/${email}`);
  }

  /**
   * Create user
   */
  async createUser(userData: any): Promise<ServiceResponse<any>> {
    return this.makeRequest("user", "POST", "/api/v1/users", userData);
  }

  /**
   * Update user
   */
  async updateUser(
    userId: number,
    userData: any
  ): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "user",
      "PATCH",
      `/api/v1/users/${userId}`,
      userData
    );
  }

  /**
   * Delete user
   */
  async deleteUser(userId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest("user", "DELETE", `/api/v1/users/${userId}`);
  }

  // ===========================================
  // CUSTOMER SERVICE COMMUNICATION
  // ===========================================

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "customer",
      "GET",
      `/api/v1/customers/${customerId}`
    );
  }

  /**
   * Get customers by user ID
   */
  async getCustomersByUserId(userId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "customer",
      "GET",
      `/api/v1/customers/user/${userId}`
    );
  }

  /**
   * Create customer
   */
  async createCustomer(customerData: any): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "customer",
      "POST",
      "/api/v1/customers",
      customerData
    );
  }

  /**
   * Update customer
   */
  async updateCustomer(
    customerId: number,
    customerData: any
  ): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "customer",
      "PATCH",
      `/api/v1/customers/${customerId}`,
      customerData
    );
  }

  // ===========================================
  // CARRIER SERVICE COMMUNICATION
  // ===========================================

  /**
   * Get carrier by ID
   */
  async getCarrier(carrierId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest("carrier", "GET", `/api/v1/carriers/${carrierId}`);
  }

  /**
   * Get carriers by user ID
   */
  async getCarriersByUserId(userId: number): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "carrier",
      "GET",
      `/api/v1/carriers/user/${userId}`
    );
  }

  /**
   * Create carrier
   */
  async createCarrier(carrierData: any): Promise<ServiceResponse<any>> {
    return this.makeRequest("carrier", "POST", "/api/v1/carriers", carrierData);
  }

  /**
   * Update carrier
   */
  async updateCarrier(
    carrierId: number,
    carrierData: any
  ): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "carrier",
      "PATCH",
      `/api/v1/carriers/${carrierId}`,
      carrierData
    );
  }

  // ===========================================
  // PRICING SERVICE COMMUNICATION
  // ===========================================

  /**
   * Calculate price
   */
  async calculatePrice(pricingData: any): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "pricing",
      "POST",
      "/api/v1/pricing/calculate",
      pricingData
    );
  }

  /**
   * Get pricing rules
   */
  async getPricingRules(): Promise<ServiceResponse<any>> {
    return this.makeRequest("pricing", "GET", "/api/v1/pricing/rules");
  }

  /**
   * Create pricing rule
   */
  async createPricingRule(ruleData: any): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "pricing",
      "POST",
      "/api/v1/pricing/rules",
      ruleData
    );
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Check if service is healthy
   */
  async checkServiceHealth(serviceName: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        serviceName,
        "GET",
        "/api/v1/health"
      );
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Get all service health status
   */
  async getAllServiceHealth(): Promise<Record<string, boolean>> {
    const services = ["user", "customer", "carrier", "pricing"];
    const healthStatus: Record<string, boolean> = {};

    await Promise.all(
      services.map(async (service) => {
        healthStatus[service] = await this.checkServiceHealth(service);
      })
    );

    return healthStatus;
  }
}

// ===========================================
// USAGE EXAMPLES
// ===========================================

/**
 * Example usage in Customer Service
 */
export class CustomerServiceWithCommunication {
  private communicator: ServiceCommunicator;

  constructor() {
    this.communicator = new ServiceCommunicator();
  }

  /**
   * Create customer with user validation
   */
  async createCustomerWithUserValidation(customerData: any) {
    // First, validate that the user exists
    const userResponse = await this.communicator.getUser(customerData.userId);

    if (userResponse.status !== 200) {
      throw new Error(`User not found: ${userResponse.error}`);
    }

    // Create customer
    const customerResponse = await this.communicator.createCustomer(
      customerData
    );

    if (customerResponse.status !== 201) {
      throw new Error(`Failed to create customer: ${customerResponse.error}`);
    }

    return customerResponse.data;
  }

  /**
   * Get customer with user details
   */
  async getCustomerWithUserDetails(customerId: number) {
    // Get customer data
    const customerResponse = await this.communicator.getCustomer(customerId);

    if (customerResponse.status !== 200) {
      throw new Error(`Customer not found: ${customerResponse.error}`);
    }

    // Get user details
    const userResponse = await this.communicator.getUser(
      customerResponse.data.userId
    );

    if (userResponse.status !== 200) {
      throw new Error(`User not found: ${userResponse.error}`);
    }

    return {
      ...customerResponse.data,
      user: userResponse.data,
    };
  }
}

/**
 * Example usage in Pricing Service
 */
export class PricingServiceWithCommunication {
  private communicator: ServiceCommunicator;

  constructor() {
    this.communicator = new ServiceCommunicator();
  }

  /**
   * Calculate price with customer and carrier validation
   */
  async calculatePriceWithValidation(pricingData: any) {
    // Validate customer exists
    const customerResponse = await this.communicator.getCustomer(
      pricingData.customerId
    );

    if (customerResponse.status !== 200) {
      throw new Error(`Customer not found: ${customerResponse.error}`);
    }

    // Validate carrier exists
    const carrierResponse = await this.communicator.getCarrier(
      pricingData.carrierId
    );

    if (carrierResponse.status !== 200) {
      throw new Error(`Carrier not found: ${carrierResponse.error}`);
    }

    // Calculate price
    const priceResponse = await this.communicator.calculatePrice(pricingData);

    if (priceResponse.status !== 200) {
      throw new Error(`Price calculation failed: ${priceResponse.error}`);
    }

    return {
      ...priceResponse.data,
      customer: customerResponse.data,
      carrier: carrierResponse.data,
    };
  }
}

// Export singleton instance
export const serviceCommunicator = new ServiceCommunicator();
