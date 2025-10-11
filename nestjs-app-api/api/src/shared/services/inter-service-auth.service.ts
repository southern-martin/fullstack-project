import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ServiceRegistryService } from "./service-registry.service";

export interface ServiceTokenPayload {
  serviceName: string;
  serviceId: string;
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
  audience: string[];
}

export interface ServiceCredentials {
  serviceName: string;
  serviceId: string;
  secret: string;
  permissions: string[];
}

export interface InterServiceAuthConfig {
  tokenExpiration: number; // in seconds
  refreshTokenExpiration: number; // in seconds
  allowedServices: string[];
  defaultPermissions: string[];
}

/**
 * Inter-Service Authentication Service
 * Handles authentication and authorization between services
 */
@Injectable()
export class InterServiceAuthService {
  private readonly logger = new Logger(InterServiceAuthService.name);
  private readonly serviceCredentials = new Map<string, ServiceCredentials>();
  private readonly serviceTokens = new Map<string, string>(); // serviceId -> token
  private readonly tokenCache = new Map<string, ServiceTokenPayload>(); // token -> payload

  constructor(
    private readonly jwtService: JwtService,
    private readonly serviceRegistry: ServiceRegistryService
  ) {
    this.initializeServiceCredentials();
  }

  /**
   * Initialize service credentials for registered services
   */
  private initializeServiceCredentials(): void {
    const services = this.serviceRegistry.getAllServices();

    for (const service of services) {
      const credentials: ServiceCredentials = {
        serviceName: service.name,
        serviceId: `${service.name}-${service.version}`,
        secret: this.generateServiceSecret(service.name),
        permissions: this.getDefaultPermissions(service.name),
      };

      this.serviceCredentials.set(service.name, credentials);
      this.logger.debug(`Initialized credentials for service: ${service.name}`);
    }
  }

  /**
   * Generate a service secret
   */
  private generateServiceSecret(serviceName: string): string {
    // In production, this should be stored securely and not generated at runtime
    return `secret-${serviceName}-${Date.now()}`;
  }

  /**
   * Get default permissions for a service
   */
  private getDefaultPermissions(serviceName: string): string[] {
    const defaultPermissions = ["read", "write"];

    // Service-specific permissions
    switch (serviceName) {
      case "auth-service":
        return [...defaultPermissions, "auth:manage", "auth:validate"];
      case "user-service":
        return [...defaultPermissions, "user:manage", "user:read"];
      case "customer-service":
        return [...defaultPermissions, "customer:manage", "customer:read"];
      case "carrier-service":
        return [...defaultPermissions, "carrier:manage", "carrier:read"];
      case "pricing-service":
        return [...defaultPermissions, "pricing:calculate", "pricing:read"];
      default:
        return defaultPermissions;
    }
  }

  /**
   * Authenticate a service and generate a token
   */
  async authenticateService(
    serviceName: string,
    serviceId: string,
    secret: string
  ): Promise<string> {
    const credentials = this.serviceCredentials.get(serviceName);

    if (!credentials) {
      throw new Error(`Service credentials not found for: ${serviceName}`);
    }

    if (credentials.serviceId !== serviceId || credentials.secret !== secret) {
      throw new Error(`Invalid service credentials for: ${serviceName}`);
    }

    const token = await this.generateServiceToken(serviceName, serviceId);
    this.serviceTokens.set(serviceId, token);

    this.logger.debug(`Service authenticated: ${serviceName} (${serviceId})`);
    return token;
  }

  /**
   * Generate a service token
   */
  private async generateServiceToken(
    serviceName: string,
    serviceId: string
  ): Promise<string> {
    const credentials = this.serviceCredentials.get(serviceName);
    if (!credentials) {
      throw new Error(`Service credentials not found for: ${serviceName}`);
    }

    const payload: ServiceTokenPayload = {
      serviceName,
      serviceId,
      permissions: credentials.permissions,
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      audience: ["microservice-oriented-api"],
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: credentials.secret,
      expiresIn: "1h",
    });

    this.tokenCache.set(token, payload);
    return token;
  }

  /**
   * Validate a service token
   */
  async validateServiceToken(
    token: string
  ): Promise<ServiceTokenPayload | null> {
    try {
      // Check cache first
      const cachedPayload = this.tokenCache.get(token);
      if (
        cachedPayload &&
        cachedPayload.expiresAt > Math.floor(Date.now() / 1000)
      ) {
        return cachedPayload;
      }

      // Decode token without verification first to get service name
      const decoded = this.jwtService.decode(token) as any;
      if (!decoded || !decoded.serviceName) {
        return null;
      }

      const credentials = this.serviceCredentials.get(decoded.serviceName);
      if (!credentials) {
        return null;
      }

      // Verify token with service secret
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: credentials.secret,
      })) as ServiceTokenPayload;

      // Check expiration
      if (payload.expiresAt <= Math.floor(Date.now() / 1000)) {
        this.tokenCache.delete(token);
        return null;
      }

      // Update cache
      this.tokenCache.set(token, payload);
      return payload;
    } catch (error) {
      this.logger.error("Service token validation failed:", error);
      return null;
    }
  }

  /**
   * Check if a service has a specific permission
   */
  async hasPermission(token: string, permission: string): Promise<boolean> {
    const payload = await this.validateServiceToken(token);
    if (!payload) {
      return false;
    }

    return payload.permissions.includes(permission);
  }

  /**
   * Check if a service can access another service
   */
  async canAccessService(
    token: string,
    targetService: string
  ): Promise<boolean> {
    const payload = await this.validateServiceToken(token);
    if (!payload) {
      return false;
    }

    // Check if the service has permission to access the target service
    const requiredPermission = `${targetService}:access`;
    return (
      payload.permissions.includes(requiredPermission) ||
      payload.permissions.includes("admin") ||
      payload.serviceName === targetService
    );
  }

  /**
   * Get service credentials
   */
  getServiceCredentials(serviceName: string): ServiceCredentials | null {
    return this.serviceCredentials.get(serviceName) || null;
  }

  /**
   * Get all service credentials (for admin purposes)
   */
  getAllServiceCredentials(): Map<string, ServiceCredentials> {
    return new Map(this.serviceCredentials);
  }

  /**
   * Refresh a service token
   */
  async refreshServiceToken(token: string): Promise<string> {
    const payload = await this.validateServiceToken(token);
    if (!payload) {
      throw new Error("Invalid token for refresh");
    }

    // Generate new token
    const newToken = await this.generateServiceToken(
      payload.serviceName,
      payload.serviceId
    );

    // Update service tokens map
    this.serviceTokens.set(payload.serviceId, newToken);

    // Remove old token from cache
    this.tokenCache.delete(token);

    this.logger.debug(`Service token refreshed for: ${payload.serviceName}`);
    return newToken;
  }

  /**
   * Revoke a service token
   */
  revokeServiceToken(token: string): boolean {
    const payload = this.tokenCache.get(token);
    if (payload) {
      this.serviceTokens.delete(payload.serviceId);
      this.tokenCache.delete(token);
      this.logger.debug(`Service token revoked for: ${payload.serviceName}`);
      return true;
    }
    return false;
  }

  /**
   * Revoke all tokens for a service
   */
  revokeAllServiceTokens(serviceName: string): number {
    const credentials = this.serviceCredentials.get(serviceName);
    if (!credentials) {
      return 0;
    }

    let revokedCount = 0;

    // Remove from service tokens map
    if (this.serviceTokens.delete(credentials.serviceId)) {
      revokedCount++;
    }

    // Remove from token cache
    for (const [token, payload] of this.tokenCache.entries()) {
      if (payload.serviceName === serviceName) {
        this.tokenCache.delete(token);
        revokedCount++;
      }
    }

    this.logger.debug(
      `Revoked ${revokedCount} tokens for service: ${serviceName}`
    );
    return revokedCount;
  }

  /**
   * Get authentication statistics
   */
  getAuthStatistics(): {
    totalServices: number;
    activeTokens: number;
    cachedTokens: number;
    services: Record<
      string,
      {
        hasCredentials: boolean;
        activeToken: boolean;
        permissions: string[];
      }
    >;
  } {
    const services: Record<string, any> = {};

    for (const [
      serviceName,
      credentials,
    ] of this.serviceCredentials.entries()) {
      const hasActiveToken = this.serviceTokens.has(credentials.serviceId);

      services[serviceName] = {
        hasCredentials: true,
        activeToken: hasActiveToken,
        permissions: credentials.permissions,
      };
    }

    return {
      totalServices: this.serviceCredentials.size,
      activeTokens: this.serviceTokens.size,
      cachedTokens: this.tokenCache.size,
      services,
    };
  }

  /**
   * Clean up expired tokens
   */
  cleanupExpiredTokens(): number {
    const now = Math.floor(Date.now() / 1000);
    let cleanedCount = 0;

    for (const [token, payload] of this.tokenCache.entries()) {
      if (payload.expiresAt <= now) {
        this.tokenCache.delete(token);
        this.serviceTokens.delete(payload.serviceId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired tokens`);
    }

    return cleanedCount;
  }

  /**
   * Start periodic token cleanup
   */
  startTokenCleanup(intervalMs: number = 300000): NodeJS.Timeout {
    // 5 minutes
    return setInterval(() => {
      this.cleanupExpiredTokens();
    }, intervalMs);
  }
}
