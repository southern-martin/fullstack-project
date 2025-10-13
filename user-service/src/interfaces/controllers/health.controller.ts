import { Controller, Get } from '@nestjs/common';

/**
 * Health Controller
 * Interface adapter for health check requests
 * Follows Clean Architecture principles
 */
@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * GET /health
   */
  @Get()
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'user-service',
    };
  }
}
