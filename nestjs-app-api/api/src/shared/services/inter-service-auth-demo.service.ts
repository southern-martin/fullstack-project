import { Injectable, Logger } from "@nestjs/common";
import { InterServiceAuthService } from "./inter-service-auth.service";

/**
 * Inter-Service Authentication Demo Service
 * Demonstrates service-to-service authentication and authorization
 */
@Injectable()
export class InterServiceAuthDemoService {
  private readonly logger = new Logger(InterServiceAuthDemoService.name);

  constructor(private readonly interServiceAuth: InterServiceAuthService) {}

  /**
   * Demo service authentication flow
   */
  async demoServiceAuthentication(serviceName: string): Promise<any> {
    this.logger.log(`Starting service authentication demo for ${serviceName}`);

    try {
      // Get service credentials
      const credentials =
        this.interServiceAuth.getServiceCredentials(serviceName);
      if (!credentials) {
        throw new Error(`Service credentials not found for: ${serviceName}`);
      }

      // Authenticate service
      const token = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      // Validate the token
      const payload = await this.interServiceAuth.validateServiceToken(token);
      if (!payload) {
        throw new Error("Token validation failed");
      }

      this.logger.log(`Service authentication successful for ${serviceName}`);

      return {
        success: true,
        serviceName,
        token,
        payload,
        credentials: {
          serviceId: credentials.serviceId,
          permissions: credentials.permissions,
        },
      };
    } catch (error) {
      this.logger.error(
        `Service authentication failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        serviceName,
        error: error.message,
      };
    }
  }

  /**
   * Demo permission checking
   */
  async demoPermissionChecking(
    serviceName: string,
    permission: string
  ): Promise<any> {
    this.logger.log(
      `Starting permission checking demo for ${serviceName} with permission: ${permission}`
    );

    try {
      // Get service credentials and authenticate
      const credentials =
        this.interServiceAuth.getServiceCredentials(serviceName);
      if (!credentials) {
        throw new Error(`Service credentials not found for: ${serviceName}`);
      }

      const token = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      // Check permission
      const hasPermission = await this.interServiceAuth.hasPermission(
        token,
        permission
      );

      this.logger.log(
        `Permission check completed for ${serviceName}: ${hasPermission}`
      );

      return {
        success: true,
        serviceName,
        permission,
        hasPermission,
        token,
      };
    } catch (error) {
      this.logger.error(
        `Permission checking failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        serviceName,
        permission,
        error: error.message,
      };
    }
  }

  /**
   * Demo service-to-service access control
   */
  async demoServiceAccessControl(
    sourceService: string,
    targetService: string
  ): Promise<any> {
    this.logger.log(
      `Starting service access control demo: ${sourceService} -> ${targetService}`
    );

    try {
      // Get source service credentials and authenticate
      const credentials =
        this.interServiceAuth.getServiceCredentials(sourceService);
      if (!credentials) {
        throw new Error(`Service credentials not found for: ${sourceService}`);
      }

      const token = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      // Check if source service can access target service
      const canAccess = await this.interServiceAuth.canAccessService(
        token,
        targetService
      );

      this.logger.log(`Service access control check completed: ${canAccess}`);

      return {
        success: true,
        sourceService,
        targetService,
        canAccess,
        token,
      };
    } catch (error) {
      this.logger.error(`Service access control check failed:`, error);
      return {
        success: false,
        sourceService,
        targetService,
        error: error.message,
      };
    }
  }

  /**
   * Demo token refresh
   */
  async demoTokenRefresh(serviceName: string): Promise<any> {
    this.logger.log(`Starting token refresh demo for ${serviceName}`);

    try {
      // Get service credentials and authenticate
      const credentials =
        this.interServiceAuth.getServiceCredentials(serviceName);
      if (!credentials) {
        throw new Error(`Service credentials not found for: ${serviceName}`);
      }

      const originalToken = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      // Wait a moment to ensure tokens are different
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh token
      const refreshedToken =
        await this.interServiceAuth.refreshServiceToken(originalToken);

      // Validate both tokens
      const originalPayload =
        await this.interServiceAuth.validateServiceToken(originalToken);
      const refreshedPayload =
        await this.interServiceAuth.validateServiceToken(refreshedToken);

      this.logger.log(`Token refresh completed for ${serviceName}`);

      return {
        success: true,
        serviceName,
        originalToken,
        refreshedToken,
        originalPayload,
        refreshedPayload,
        tokensAreDifferent: originalToken !== refreshedToken,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed for ${serviceName}:`, error);
      return {
        success: false,
        serviceName,
        error: error.message,
      };
    }
  }

  /**
   * Demo token revocation
   */
  async demoTokenRevocation(serviceName: string): Promise<any> {
    this.logger.log(`Starting token revocation demo for ${serviceName}`);

    try {
      // Get service credentials and authenticate
      const credentials =
        this.interServiceAuth.getServiceCredentials(serviceName);
      if (!credentials) {
        throw new Error(`Service credentials not found for: ${serviceName}`);
      }

      const token = await this.interServiceAuth.authenticateService(
        credentials.serviceName,
        credentials.serviceId,
        credentials.secret
      );

      // Validate token before revocation
      const payloadBeforeRevocation =
        await this.interServiceAuth.validateServiceToken(token);
      if (!payloadBeforeRevocation) {
        throw new Error("Token validation failed before revocation");
      }

      // Revoke token
      const revoked = this.interServiceAuth.revokeServiceToken(token);

      // Try to validate token after revocation
      const payloadAfterRevocation =
        await this.interServiceAuth.validateServiceToken(token);

      this.logger.log(
        `Token revocation completed for ${serviceName}: ${revoked}`
      );

      return {
        success: true,
        serviceName,
        token,
        revoked,
        payloadBeforeRevocation,
        payloadAfterRevocation,
        tokenStillValid: payloadAfterRevocation !== null,
      };
    } catch (error) {
      this.logger.error(`Token revocation failed for ${serviceName}:`, error);
      return {
        success: false,
        serviceName,
        error: error.message,
      };
    }
  }

  /**
   * Demo comprehensive authentication flow
   */
  async demoComprehensiveAuthFlow(): Promise<any> {
    this.logger.log("Starting comprehensive authentication flow demo");

    const results = {
      serviceAuthentication: {} as any,
      permissionChecking: {} as any,
      serviceAccessControl: {} as any,
      tokenRefresh: {} as any,
      tokenRevocation: {} as any,
      statistics: {} as any,
    };

    try {
      // Test with user service
      results.serviceAuthentication.userService =
        await this.demoServiceAuthentication("user-service");

      // Test permission checking
      results.permissionChecking.userRead = await this.demoPermissionChecking(
        "user-service",
        "user:read"
      );
      results.permissionChecking.userManage = await this.demoPermissionChecking(
        "user-service",
        "user:manage"
      );
      results.permissionChecking.authManage = await this.demoPermissionChecking(
        "user-service",
        "auth:manage"
      );

      // Test service access control
      results.serviceAccessControl.userToCustomer =
        await this.demoServiceAccessControl("user-service", "customer-service");
      results.serviceAccessControl.userToAuth =
        await this.demoServiceAccessControl("user-service", "auth-service");

      // Test token refresh
      results.tokenRefresh.userService =
        await this.demoTokenRefresh("user-service");

      // Test token revocation
      results.tokenRevocation.userService =
        await this.demoTokenRevocation("user-service");

      // Get statistics
      results.statistics = this.interServiceAuth.getAuthStatistics();

      this.logger.log("Comprehensive authentication flow demo completed");

      return {
        success: true,
        message: "Comprehensive authentication flow demo completed",
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        "Comprehensive authentication flow demo failed:",
        error
      );
      return {
        success: false,
        message: "Comprehensive authentication flow demo failed",
        error: error.message,
        data: results,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo all services authentication
   */
  async demoAllServicesAuthentication(): Promise<any> {
    this.logger.log("Starting all services authentication demo");

    const results: any = {};
    const services = [
      "auth-service",
      "user-service",
      "customer-service",
      "carrier-service",
      "pricing-service",
    ];

    try {
      for (const serviceName of services) {
        results[serviceName] =
          await this.demoServiceAuthentication(serviceName);
      }

      this.logger.log("All services authentication demo completed");

      return {
        success: true,
        message: "All services authentication demo completed",
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("All services authentication demo failed:", error);
      return {
        success: false,
        message: "All services authentication demo failed",
        error: error.message,
        data: results,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo permission matrix
   */
  async demoPermissionMatrix(): Promise<any> {
    this.logger.log("Starting permission matrix demo");

    const results: any = {};
    const services = [
      "auth-service",
      "user-service",
      "customer-service",
      "carrier-service",
      "pricing-service",
    ];
    const permissions = [
      "read",
      "write",
      "user:read",
      "user:manage",
      "auth:manage",
      "customer:read",
      "carrier:read",
      "pricing:calculate",
    ];

    try {
      for (const serviceName of services) {
        results[serviceName] = {};

        for (const permission of permissions) {
          results[serviceName][permission] = await this.demoPermissionChecking(
            serviceName,
            permission
          );
        }
      }

      this.logger.log("Permission matrix demo completed");

      return {
        success: true,
        message: "Permission matrix demo completed",
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Permission matrix demo failed:", error);
      return {
        success: false,
        message: "Permission matrix demo failed",
        error: error.message,
        data: results,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get authentication statistics
   */
  getAuthenticationStatistics(): any {
    return this.interServiceAuth.getAuthStatistics();
  }

  /**
   * Clean up expired tokens
   */
  cleanupExpiredTokens(): number {
    return this.interServiceAuth.cleanupExpiredTokens();
  }
}
