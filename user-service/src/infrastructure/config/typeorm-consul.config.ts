/**
 * TypeORM Configuration with Consul Integration
 *
 * This module provides TypeORM configuration that reads from Consul KV store
 * instead of environment variables, enabling centralized configuration management.
 *
 * Week 2 Implementation: Database Configuration from Consul
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WinstonLoggerService } from '@shared/infrastructure/logging';
import { ConsulConfigService } from './consul.config';
import { PermissionTypeOrmEntity } from '../database/typeorm/entities/permission.typeorm.entity';
import { RoleTypeOrmEntity } from '../database/typeorm/entities/role.typeorm.entity';
import { UserProfileTypeOrmEntity } from '../database/typeorm/entities/user-profile.typeorm.entity';
import { UserTypeOrmEntity } from '../database/typeorm/entities/user.typeorm.entity';

/**
 * Create TypeORM configuration from Consul
 *
 * This factory function creates TypeORM options by reading database
 * configuration from Consul KV store. Falls back to environment variables
 * if Consul is unavailable.
 */
export async function createTypeOrmConsulConfig(): Promise<TypeOrmModuleOptions> {
  const consulConfig = ConsulConfigService.getInstance();
  const logger = new WinstonLoggerService();
  logger.setContext('TypeOrmConsulConfig');

  try {
    // Initialize Consul if not already initialized
    if (!consulConfig['initialized']) {
      await consulConfig.initialize();
    }

    // Read database configuration from Consul (shared infrastructure)
    const dbHost = await consulConfig.getShared(
      'database/shared_user_db/host',
      process.env.DB_HOST || 'localhost',
    );
    const dbPort = await consulConfig.getSharedNumber(
      'database/shared_user_db/port',
      parseInt(process.env.DB_PORT || '3306'),
    );
    const dbUsername = await consulConfig.getShared(
      'database/shared_user_db/username',
      process.env.DB_USERNAME || 'shared_user',
    );
    const dbPassword = await consulConfig.getShared(
      'database/shared_user_db/password',
      process.env.DB_PASSWORD || 'shared_password_2024',
    );
    const dbName = await consulConfig.getShared(
      'database/shared_user_db/database',
      process.env.DB_NAME || 'shared_user_db',
    );

    logger.log('Database configuration loaded from Consul', {
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUsername,
    });

    return {
      type: 'mysql',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbName,
      entities: [
        UserTypeOrmEntity,
        RoleTypeOrmEntity,
        PermissionTypeOrmEntity,
        UserProfileTypeOrmEntity,
      ],
      synchronize: false, // CRITICAL: Disabled - use migrations for schema changes
      migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
      migrationsRun: true, // Auto-run pending migrations on startup
      logging: false, // Disable SQL logging (use Winston for structured logs)
      maxQueryExecutionTime: 1000, // Log slow queries > 1s
    };
  } catch (error) {
    logger.error(
      'Failed to load configuration from Consul, falling back to environment variables',
      error instanceof Error ? error.stack : String(error),
    );

    // Fallback to environment variables
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'shared_user',
      password: process.env.DB_PASSWORD || 'shared_password_2024',
      database: process.env.DB_NAME || 'shared_user_db',
      entities: [
        UserTypeOrmEntity,
        RoleTypeOrmEntity,
        PermissionTypeOrmEntity,
        UserProfileTypeOrmEntity,
      ],
      synchronize: false,
      migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
      migrationsRun: true,
      logging: false,
      maxQueryExecutionTime: 1000,
    };
  }
}

/**
 * Get TypeORM configuration synchronously (for compatibility)
 * Uses environment variables with Consul values as defaults
 */
export function getTypeOrmConfigSync(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'shared_user',
    password: process.env.DB_PASSWORD || 'shared_password_2024',
    database: process.env.DB_NAME || 'shared_user_db',
    entities: [
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      PermissionTypeOrmEntity,
      UserProfileTypeOrmEntity,
    ],
    synchronize: false,
    migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
    migrationsRun: true,
    logging: false,
    maxQueryExecutionTime: 1000,
  };
}
