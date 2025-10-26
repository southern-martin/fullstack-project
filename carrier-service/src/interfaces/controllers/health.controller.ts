import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Health Controller
 * Interface adapter for health check requests
 * Follows Clean Architecture principles
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * GET /health
   */
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'carrier-service',
    };
  }
}
