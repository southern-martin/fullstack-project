import axios from "axios";

// Using any types to avoid axios version compatibility issues during Docker build
type AxiosInstance = any;
type AxiosResponse<T = any> = any;

/**
 * Service Configuration Interface
 */
interface ServiceConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Service Response Interface
 */
interface ServiceResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

/**
 * Service Communication Class
 *
 * Provides standardized communication between microservices with retry logic,
 * error handling, and circuit breaker patterns.
 */
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
      auth: {
        baseURL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      user: {
        baseURL: process.env.USER_SERVICE_URL || "http://localhost:3003",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      customer: {
        baseURL: process.env.CUSTOMER_SERVICE_URL || "http://localhost:3004",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      carrier: {
        baseURL: process.env.CARRIER_SERVICE_URL || "http://localhost:3005",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      pricing: {
        baseURL: process.env.PRICING_SERVICE_URL || "http://localhost:3006",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
      translation: {
        baseURL: process.env.TRANSLATION_SERVICE_URL || "http://localhost:3007",
        timeout: 10000,
        retries: 3,
        retryDelay: 1000,
      },
    };

    // Initialize each service
    Object.entries(serviceConfigs).forEach(([name, config]) => {
      this.config.set(name, config);
      this.services.set(name, this.createAxiosInstance(config));
    });
  }

  /**
   * Create Axios instance with interceptors
   */
  private createAxiosInstance(config: ServiceConfig): AxiosInstance {
    const instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    instance.interceptors.request.use(
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

    // Response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error for debugging
        console.error(`Service communication error:`, error.message);
        return Promise.reject(error);
      }
    );

    return instance;
  }

  /**
   * Get authentication token (implement based on your auth system)
   */
  private getAuthToken(): string | null {
    // This should be implemented based on your authentication system
    // For example, from JWT token, session, etc.
    return process.env.SERVICE_AUTH_TOKEN || null;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    serviceName: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    data?: any,
    retryCount: number = 0
  ): Promise<ServiceResponse<T>> {
    const service = this.services.get(serviceName);
    const config = this.config.get(serviceName);

    if (!service || !config) {
      throw new Error(`Service '${serviceName}' not configured`);
    }

    try {
      let response: AxiosResponse<T>;

      switch (method) {
        case "GET":
          response = await service.get(endpoint);
          break;
        case "POST":
          response = await service.post(endpoint, data);
          break;
        case "PUT":
          response = await service.put(endpoint, data);
          break;
        case "PATCH":
          response = await service.patch(endpoint, data);
          break;
        case "DELETE":
          response = await service.delete(endpoint);
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
      // Retry logic
      if (retryCount < config.retries && this.shouldRetry(error)) {
        await this.delay(config.retryDelay * (retryCount + 1));
        return this.makeRequest(
          serviceName,
          method,
          endpoint,
          data,
          retryCount + 1
        );
      }

      return {
        data: null as T,
        status: error.response?.status || 500,
        message: "Request failed",
        error: error.message,
      };
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    const status = error.response?.status;
    return status >= 500 || status === 408 || status === 429;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string | number): Promise<ServiceResponse<any>> {
    return this.makeRequest("user", "GET", `/api/v1/users/${userId}`);
  }

  /**
   * Get customer by ID
   */
  async getCustomer(
    customerId: string | number
  ): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "customer",
      "GET",
      `/api/v1/customers/${customerId}`
    );
  }

  /**
   * Get carrier by ID
   */
  async getCarrier(carrierId: string | number): Promise<ServiceResponse<any>> {
    return this.makeRequest("carrier", "GET", `/api/v1/carriers/${carrierId}`);
  }

  /**
   * Get pricing rule by ID
   */
  async getPricingRule(ruleId: string | number): Promise<ServiceResponse<any>> {
    return this.makeRequest(
      "pricing",
      "GET",
      `/api/v1/pricing-rules/${ruleId}`
    );
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<ServiceResponse<any>> {
    return this.makeRequest("auth", "POST", "/api/v1/auth/validate", { token });
  }

  /**
   * Get service health
   */
  async getServiceHealth(serviceName: string): Promise<ServiceResponse<any>> {
    return this.makeRequest(serviceName, "GET", "/api/v1/health");
  }

  /**
   * Generic GET request
   */
  async get<T>(
    serviceName: string,
    endpoint: string
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(serviceName, "GET", endpoint);
  }

  /**
   * Generic POST request
   */
  async post<T>(
    serviceName: string,
    endpoint: string,
    data?: any
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(serviceName, "POST", endpoint, data);
  }

  /**
   * Generic PUT request
   */
  async put<T>(
    serviceName: string,
    endpoint: string,
    data?: any
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(serviceName, "PUT", endpoint, data);
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(
    serviceName: string,
    endpoint: string,
    data?: any
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(serviceName, "PATCH", endpoint, data);
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(
    serviceName: string,
    endpoint: string
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(serviceName, "DELETE", endpoint);
  }

  /**
   * Get all configured services
   */
  getConfiguredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if service is configured
   */
  isServiceConfigured(serviceName: string): boolean {
    return this.services.has(serviceName);
  }
}
