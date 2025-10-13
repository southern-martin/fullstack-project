import { Controller, Get } from "@nestjs/common";

/**
 * HealthController
 *
 * This controller provides a health check endpoint for the Translation Service.
 * It's a simple endpoint to verify that the service is running and responsive.
 * Follows Clean Architecture principles
 */
@Controller("health")
export class HealthController {
  /**
   * Handles GET requests to /health.
   * @returns An object indicating the service status, timestamp, and service name.
   */
  @Get()
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    version: string;
  }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "translation-service",
      version: "1.0.0",
    };
  }
}
