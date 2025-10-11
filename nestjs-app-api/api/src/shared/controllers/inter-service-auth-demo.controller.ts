import { Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { InterServiceAuthDemoService } from "../services/inter-service-auth-demo.service";

/**
 * Inter-Service Authentication Demo Controller
 * Provides endpoints to demonstrate service-to-service authentication
 */
@Controller("inter-service-auth-demo")
export class InterServiceAuthDemoController {
  private readonly logger = new Logger(InterServiceAuthDemoController.name);

  constructor(
    private readonly interServiceAuthDemo: InterServiceAuthDemoService
  ) {}

  /**
   * Demo service authentication
   */
  @Get("authenticate/:serviceName")
  async demoServiceAuthentication(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting service authentication demo for ${serviceName}`);
    try {
      const result =
        await this.interServiceAuthDemo.demoServiceAuthentication(serviceName);
      return {
        success: true,
        message: `Service authentication demo completed for ${serviceName}`,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Service authentication demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `Service authentication demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo permission checking
   */
  @Get("permission/:serviceName/:permission")
  async demoPermissionChecking(
    @Param("serviceName") serviceName: string,
    @Param("permission") permission: string
  ) {
    this.logger.log(
      `Starting permission checking demo for ${serviceName} with permission: ${permission}`
    );
    try {
      const result = await this.interServiceAuthDemo.demoPermissionChecking(
        serviceName,
        permission
      );
      return {
        success: true,
        message: `Permission checking demo completed for ${serviceName}`,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Permission checking demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `Permission checking demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo service access control
   */
  @Get("access-control/:sourceService/:targetService")
  async demoServiceAccessControl(
    @Param("sourceService") sourceService: string,
    @Param("targetService") targetService: string
  ) {
    this.logger.log(
      `Starting service access control demo: ${sourceService} -> ${targetService}`
    );
    try {
      const result = await this.interServiceAuthDemo.demoServiceAccessControl(
        sourceService,
        targetService
      );
      return {
        success: true,
        message: `Service access control demo completed: ${sourceService} -> ${targetService}`,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Service access control demo failed:`, error);
      return {
        success: false,
        message: "Service access control demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo token refresh
   */
  @Post("refresh-token/:serviceName")
  async demoTokenRefresh(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting token refresh demo for ${serviceName}`);
    try {
      const result =
        await this.interServiceAuthDemo.demoTokenRefresh(serviceName);
      return {
        success: true,
        message: `Token refresh demo completed for ${serviceName}`,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Token refresh demo failed for ${serviceName}:`, error);
      return {
        success: false,
        message: `Token refresh demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo token revocation
   */
  @Post("revoke-token/:serviceName")
  async demoTokenRevocation(@Param("serviceName") serviceName: string) {
    this.logger.log(`Starting token revocation demo for ${serviceName}`);
    try {
      const result =
        await this.interServiceAuthDemo.demoTokenRevocation(serviceName);
      return {
        success: true,
        message: `Token revocation demo completed for ${serviceName}`,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Token revocation demo failed for ${serviceName}:`,
        error
      );
      return {
        success: false,
        message: `Token revocation demo failed for ${serviceName}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo all services authentication
   */
  @Get("authenticate-all")
  async demoAllServicesAuthentication() {
    this.logger.log("Starting all services authentication demo");
    try {
      const result =
        await this.interServiceAuthDemo.demoAllServicesAuthentication();
      return result;
    } catch (error) {
      this.logger.error("All services authentication demo failed:", error);
      return {
        success: false,
        message: "All services authentication demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo permission matrix
   */
  @Get("permission-matrix")
  async demoPermissionMatrix() {
    this.logger.log("Starting permission matrix demo");
    try {
      const result = await this.interServiceAuthDemo.demoPermissionMatrix();
      return result;
    } catch (error) {
      this.logger.error("Permission matrix demo failed:", error);
      return {
        success: false,
        message: "Permission matrix demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Demo comprehensive authentication flow
   */
  @Post("comprehensive-demo")
  async demoComprehensiveAuthFlow() {
    this.logger.log("Starting comprehensive authentication flow demo");
    try {
      const result =
        await this.interServiceAuthDemo.demoComprehensiveAuthFlow();
      return result;
    } catch (error) {
      this.logger.error(
        "Comprehensive authentication flow demo failed:",
        error
      );
      return {
        success: false,
        message: "Comprehensive authentication flow demo failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get authentication statistics
   */
  @Get("statistics")
  async getAuthenticationStatistics() {
    this.logger.log("Getting authentication statistics");
    try {
      const statistics =
        this.interServiceAuthDemo.getAuthenticationStatistics();
      return {
        success: true,
        message: "Authentication statistics retrieved successfully",
        data: statistics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to get authentication statistics:", error);
      return {
        success: false,
        message: "Failed to get authentication statistics",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Clean up expired tokens
   */
  @Post("cleanup-expired-tokens")
  async cleanupExpiredTokens() {
    this.logger.log("Cleaning up expired tokens");
    try {
      const cleanedCount = this.interServiceAuthDemo.cleanupExpiredTokens();
      return {
        success: true,
        message: `Cleaned up ${cleanedCount} expired tokens`,
        data: { cleanedCount },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to cleanup expired tokens:", error);
      return {
        success: false,
        message: "Failed to cleanup expired tokens",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Run all inter-service authentication demos
   */
  @Post("run-all-demos")
  async runAllDemos() {
    this.logger.log("Starting all inter-service authentication demos");
    const results = {
      allServicesAuth: null,
      permissionMatrix: null,
      comprehensiveFlow: null,
      statistics: null,
    };

    try {
      // Run all services authentication demo
      try {
        results.allServicesAuth =
          await this.interServiceAuthDemo.demoAllServicesAuthentication();
      } catch (error) {
        results.allServicesAuth = { error: error.message };
      }

      // Run permission matrix demo
      try {
        results.permissionMatrix =
          await this.interServiceAuthDemo.demoPermissionMatrix();
      } catch (error) {
        results.permissionMatrix = { error: error.message };
      }

      // Run comprehensive flow demo
      try {
        results.comprehensiveFlow =
          await this.interServiceAuthDemo.demoComprehensiveAuthFlow();
      } catch (error) {
        results.comprehensiveFlow = { error: error.message };
      }

      // Get statistics
      try {
        results.statistics =
          this.interServiceAuthDemo.getAuthenticationStatistics();
      } catch (error) {
        results.statistics = { error: error.message };
      }

      return {
        success: true,
        message: "All inter-service authentication demos completed",
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Failed to run all demos:", error);
      return {
        success: false,
        message: "Failed to run all demos",
        error: error.message,
        data: results,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
