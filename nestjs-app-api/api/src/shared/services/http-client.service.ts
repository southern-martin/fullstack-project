import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ResilienceConfig, ResilienceService } from "./resilience.service";
import { ServiceRegistryService } from "./service-registry.service";

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxRetryDelay: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export interface ServiceCallOptions {
  timeout?: number;
  retry?: RetryConfig;
  circuitBreaker?: CircuitBreakerConfig;
  fallback?: () => Promise<any>;
}

export interface ServiceEndpoint {
  serviceName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
}

/**
 * Enhanced HTTP Client Service for Service-to-Service Communication
 * Provides retry logic, circuit breakers, and resilience patterns
 */
@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly httpClient: AxiosInstance;
  private readonly circuitBreakers = new Map<string, CircuitBreakerState>();
  private readonly retryConfigs = new Map<string, RetryConfig>();

  constructor(
    private readonly serviceRegistry: ServiceRegistryService,
    private readonly resilienceService: ResilienceService
  ) {
    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Microservice-Oriented-Client/1.0.0",
      },
    });

    // Add request/response interceptors
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Making HTTP request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        this.logger.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `HTTP response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        this.logger.error(
          `HTTP error: ${error.response?.status} ${error.config?.url}`,
          error.message
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Call a service endpoint with advanced resilience patterns using ResilienceService
   */
  async callServiceEndpointWithResilience<T>(
    serviceName: string,
    endpoint: string,
    data?: any,
    resilienceConfig?: ResilienceConfig
  ): Promise<T> {
    const service = this.serviceRegistry.getService(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    const serviceUrl = this.buildServiceUrl(service, endpoint);
    const circuitBreakerKey = `${serviceName}:${endpoint}`;

    return await this.resilienceService.execute(
      circuitBreakerKey,
      () => this.makeHttpRequest(serviceUrl, data),
      resilienceConfig,
      () => this.createFallbackResponse(serviceName, endpoint)
    );
  }

  /**
   * Call a service endpoint with advanced resilience patterns (legacy method)
   */
  async callServiceEndpoint<T>(
    serviceName: string,
    endpoint: string,
    data?: any,
    options: ServiceCallOptions = {}
  ): Promise<T> {
    const service = this.serviceRegistry.getService(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    const serviceUrl = this.buildServiceUrl(service, endpoint);
    const circuitBreakerKey = `${serviceName}:${endpoint}`;

    // Check circuit breaker
    if (this.isCircuitBreakerOpen(circuitBreakerKey)) {
      this.logger.warn(
        `Circuit breaker open for ${circuitBreakerKey}, using fallback`
      );
      if (options.fallback) {
        return await options.fallback();
      }
      throw new Error(`Circuit breaker open for ${circuitBreakerKey}`);
    }

    const retryConfig = options.retry || this.getDefaultRetryConfig();
    const timeout = options.timeout || 10000;

    try {
      const result = await this.executeWithRetry(
        () => this.makeHttpRequest(serviceUrl, data, timeout),
        retryConfig,
        circuitBreakerKey
      );

      this.recordSuccess(circuitBreakerKey);
      return result.data;
    } catch (error) {
      this.recordFailure(circuitBreakerKey);
      throw error;
    }
  }

  /**
   * Execute HTTP request with retry logic
   */
  private async executeWithRetry<T>(
    operation: () => Promise<AxiosResponse<T>>,
    retryConfig: RetryConfig,
    circuitBreakerKey: string
  ): Promise<AxiosResponse<T>> {
    let lastError: Error;
    let delay = retryConfig.retryDelay;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.debug(
            `Retry attempt ${attempt}/${retryConfig.maxRetries} for ${circuitBreakerKey}`
          );
          await this.sleep(delay);
          delay = Math.min(
            delay * retryConfig.backoffMultiplier,
            retryConfig.maxRetryDelay
          );
        }

        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain error types
        if (this.shouldNotRetry(error)) {
          throw error;
        }

        if (attempt === retryConfig.maxRetries) {
          this.logger.error(
            `Max retries exceeded for ${circuitBreakerKey}`,
            lastError
          );
          throw lastError;
        }
      }
    }

    throw lastError!;
  }

  /**
   * Make HTTP request to service
   */
  private async makeHttpRequest(
    url: string,
    data?: any,
    timeout: number = 10000
  ): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      url,
      timeout,
      method: data ? "POST" : "GET",
      data,
    };

    return await this.httpClient.request(config);
  }

  /**
   * Build service URL from service registry
   */
  private buildServiceUrl(service: any, endpoint: string): string {
    // For microservice-oriented architecture, we use local endpoints
    // In true microservices, this would use service discovery
    const baseUrl = service.baseUrl || "http://localhost:3001/api/v1";
    return `${baseUrl}/${endpoint}`;
  }

  /**
   * Check if circuit breaker is open
   */
  private isCircuitBreakerOpen(key: string): boolean {
    const state = this.circuitBreakers.get(key);
    if (!state) return false;

    if (state.state === "OPEN") {
      if (Date.now() - state.lastFailureTime > state.recoveryTimeout) {
        // Try to recover
        state.state = "HALF_OPEN";
        this.logger.debug(`Circuit breaker ${key} moved to HALF_OPEN`);
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Record successful request
   */
  private recordSuccess(key: string): void {
    const state = this.circuitBreakers.get(key);
    if (state && state.state === "HALF_OPEN") {
      state.state = "CLOSED";
      state.failureCount = 0;
      this.logger.debug(`Circuit breaker ${key} moved to CLOSED`);
    }
  }

  /**
   * Record failed request
   */
  private recordFailure(key: string): void {
    const state = this.circuitBreakers.get(key) || {
      state: "CLOSED",
      failureCount: 0,
      lastFailureTime: 0,
      recoveryTimeout: 30000,
    };

    state.failureCount++;
    state.lastFailureTime = Date.now();

    if (state.failureCount >= 5) {
      // Default failure threshold
      state.state = "OPEN";
      this.logger.warn(`Circuit breaker ${key} moved to OPEN`);
    }

    this.circuitBreakers.set(key, state);
  }

  /**
   * Determine if error should not be retried
   */
  private shouldNotRetry(error: any): boolean {
    // Don't retry on client errors (4xx) except 408, 429
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return ![408, 429].includes(error.response.status);
    }

    // Don't retry on certain error types
    return error.code === "ENOTFOUND" || error.code === "ECONNREFUSED";
  }

  /**
   * Get default retry configuration
   */
  private getDefaultRetryConfig(): RetryConfig {
    return {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxRetryDelay: 10000,
    };
  }

  /**
   * Create fallback response for failed service calls
   */
  private async createFallbackResponse(
    serviceName: string,
    endpoint: string
  ): Promise<any> {
    this.logger.warn(`Using fallback response for ${serviceName}:${endpoint}`);

    // Return a default fallback response based on the endpoint
    if (endpoint.includes("users")) {
      return {
        users: [],
        total: 0,
        message: "Service temporarily unavailable",
      };
    } else if (endpoint.includes("customers")) {
      return {
        customers: [],
        total: 0,
        message: "Service temporarily unavailable",
      };
    } else if (endpoint.includes("carriers")) {
      return {
        carriers: [],
        total: 0,
        message: "Service temporarily unavailable",
      };
    } else if (endpoint.includes("auth")) {
      return { error: "Authentication service temporarily unavailable" };
    }

    return {
      error: "Service temporarily unavailable",
      service: serviceName,
      endpoint,
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    for (const [key, state] of this.circuitBreakers.entries()) {
      status[key] = {
        state: state.state,
        failureCount: state.failureCount,
        lastFailureTime: new Date(state.lastFailureTime).toISOString(),
      };
    }
    return status;
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(key: string): void {
    this.circuitBreakers.delete(key);
    this.logger.debug(`Circuit breaker ${key} reset`);
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.clear();
    this.logger.debug("All circuit breakers reset");
  }
}

interface CircuitBreakerState {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  lastFailureTime: number;
  recoveryTimeout: number;
}
