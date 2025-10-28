/**
 * TypeORM Configuration with Consul Integration - Customer Service
 * 
 * This module provides TypeORM configuration that reads from Consul KV store
 * instead of environment variables, enabling centralized configuration management.
 * 
 * Week 2 Implementation: Database Configuration from Consul
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConsulConfigService } from './consul.config';
import { CustomerTypeOrmEntity } from '../database/typeorm/entities/customer.typeorm.entity';

/**
 * Create TypeORM configuration from Consul
 * 
 * This factory function creates TypeORM options by reading database
 * configuration from Consul KV store. Falls back to environment variables
 * if Consul is unavailable.
 */
export async function createTypeOrmConsulConfig(): Promise<TypeOrmModuleOptions> {
  const consulConfig = ConsulConfigService.getInstance();
  
  try {
    // Initialize Consul if not already initialized
    if (!consulConfig['initialized']) {
      await consulConfig.initialize();
    }
    
    // Read database configuration from Consul (service-specific database)
    const dbHost = await consulConfig.get(
      'database/host',
      process.env.DB_HOST || 'localhost'
    );
    const dbPort = await consulConfig.getNumber(
      'database/port',
      parseInt(process.env.DB_PORT || '3306')
    );
    const dbUsername = await consulConfig.get(
      'database/username',
      process.env.DB_USERNAME || 'customer_user'
    );
    const dbPassword = await consulConfig.get(
      'database/password',
      process.env.DB_PASSWORD || 'customer_password'
    );
    const dbName = await consulConfig.get(
      'database/database',
      process.env.DB_NAME || 'customer_service_db'
    );
    
    console.log('[TypeORM] Database configuration loaded from Consul:');
    console.log(`[TypeORM]   Host: ${dbHost}`);
    console.log(`[TypeORM]   Port: ${dbPort}`);
    console.log(`[TypeORM]   Database: ${dbName}`);
    console.log(`[TypeORM]   Username: ${dbUsername}`);
    
    return {
      type: 'mysql',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbName,
      entities: [CustomerTypeOrmEntity],
      synchronize: false, // CRITICAL: Disabled - use migrations for schema changes
      migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
      migrationsRun: true, // Auto-run pending migrations on startup
      logging: false, // Disable SQL logging (use Winston for structured logs)
      maxQueryExecutionTime: 1000, // Log slow queries > 1s
    };
  } catch (error) {
    console.error('[TypeORM] Failed to load configuration from Consul, falling back to environment variables');
    console.error('[TypeORM] Error:', error);
    
    // Fallback to environment variables
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'customer_user',
      password: process.env.DB_PASSWORD || 'customer_password',
      database: process.env.DB_NAME || 'customer_service_db',
      entities: [CustomerTypeOrmEntity],
      synchronize: false,
      migrations: ['dist/infrastructure/database/typeorm/migrations/*.js'],
      migrationsRun: true,
      logging: false,
      maxQueryExecutionTime: 1000,
    };
  }
}
