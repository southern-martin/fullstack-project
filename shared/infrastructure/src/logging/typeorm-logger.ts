import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { WinstonLoggerService } from './winston-logger.service';

/**
 * TypeORM Logger
 * Integrates TypeORM logging with Winston structured logging
 */
export class TypeOrmWinstonLogger implements TypeOrmLogger {
  private logger: WinstonLoggerService;

  constructor() {
    this.logger = new WinstonLoggerService();
    this.logger.setContext('TypeORM');
  }

  /**
   * Log a query
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const startTime = queryRunner?.data?.queryStartTime;
    const duration = startTime ? Date.now() - startTime : 0;

    this.logger.logQuery(query, parameters || [], duration);
  }

  /**
   * Log a slow query
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warn(`Slow query detected (${time}ms)`, {
      time,
      query,
      parameters,
      type: 'slow_query',
    }, 'TypeORM');
  }

  /**
   * Log query error
   */
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'object' ? error.stack : undefined;

    this.logger.error(`Query failed: ${errorMessage}`, errorStack, 'TypeORM');
    this.logger.logQuery(
      query,
      parameters || [],
      0,
      typeof error === 'string' ? new Error(error) : error
    );
  }

  /**
   * Log schema build
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`Schema: ${message}`);
  }

  /**
   * Log migration
   */
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`Migration: ${message}`);
  }

  /**
   * Log general message
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.log(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }
}
