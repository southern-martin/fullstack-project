import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * HTTP Client Configuration
 */
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

/**
 * HTTP Client Response
 */
export interface HttpClientResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
}

/**
 * HTTP Client
 *
 * A robust HTTP client with retry logic, error handling, and request/response interceptors.
 */
export class HttpClient {
  private instance: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    };

    this.instance = this.createAxiosInstance();
  }

  /**
   * Create Axios instance with interceptors
   */
  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        // Add request timestamp
        (config as any).metadata = { startTime: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => {
        // Add response time
        const duration =
          Date.now() - (response.config as any).metadata?.startTime;
        (response.config as any).metadata = {
          ...(response.config as any).metadata,
          duration,
        };
        return response;
      },
      (error) => {
        // Add error information
        if ((error.config as any)?.metadata) {
          const duration =
            Date.now() - (error.config as any).metadata.startTime;
          (error.config as any).metadata.duration = duration;
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryCount: number = 0
  ): Promise<HttpClientResponse<T>> {
    try {
      let response: AxiosResponse<T>;

      switch (method) {
        case "GET":
          response = await this.instance.get(url, config);
          break;
        case "POST":
          response = await this.instance.post(url, data, config);
          break;
        case "PUT":
          response = await this.instance.put(url, data, config);
          break;
        case "PATCH":
          response = await this.instance.patch(url, data, config);
          break;
        case "DELETE":
          response = await this.instance.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        success: true,
      };
    } catch (error: any) {
      // Retry logic
      if (retryCount < (this.config.retries || 3) && this.shouldRetry(error)) {
        await this.delay((this.config.retryDelay || 1000) * (retryCount + 1));
        return this.makeRequest(method, url, data, config, retryCount + 1);
      }

      return {
        data: null as T,
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Internal Server Error",
        headers: error.response?.headers || {},
        success: false,
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
   * GET request
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>("GET", url, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>("POST", url, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>("PUT", url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>("PATCH", url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>("DELETE", url, undefined, config);
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.config.headers, headers);
    this.instance.defaults.headers = {
      ...this.instance.defaults.headers,
      ...headers,
    };
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * Remove authorization header
   */
  removeAuthToken(): void {
    delete this.instance.defaults.headers.Authorization;
  }

  /**
   * Get current configuration
   */
  getConfig(): HttpClientConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<HttpClientConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.baseURL) {
      this.instance.defaults.baseURL = newConfig.baseURL;
    }
    if (newConfig.timeout) {
      this.instance.defaults.timeout = newConfig.timeout;
    }
    if (newConfig.headers) {
      this.setDefaultHeaders(newConfig.headers);
    }
  }
}
