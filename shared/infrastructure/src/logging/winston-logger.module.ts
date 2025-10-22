import { Module, Global } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

/**
 * Global Winston Logger Module
 * Provides structured JSON logging for all microservices
 */
@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
