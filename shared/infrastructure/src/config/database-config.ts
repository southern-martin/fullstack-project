import { DataSourceOptions } from "typeorm";
import { DatabaseConfig } from "./service-config";

/**
 * Database Configuration Builder
 *
 * Builds TypeORM DataSource options from service configuration.
 */
export class DatabaseConfigBuilder {
  /**
   * Build TypeORM DataSource options
   */
  static buildDataSourceOptions(
    config: DatabaseConfig,
    entities: any[]
  ): DataSourceOptions {
    return {
      type: "mysql",
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities,
      synchronize: config.synchronize,
      logging: config.logging,
      ssl: false,
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        charset: "utf8mb4",
        timezone: "Z",
      },
      migrations: [],
      subscribers: [],
    };
  }

  /**
   * Build connection string
   */
  static buildConnectionString(config: DatabaseConfig): string {
    return `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  }

  /**
   * Build connection options for different environments
   */
  static buildEnvironmentOptions(
    config: DatabaseConfig,
    entities: any[],
    environment: string
  ): DataSourceOptions {
    const baseOptions = this.buildDataSourceOptions(config, entities);

    switch (environment) {
      case "development":
        return {
          ...baseOptions,
          synchronize: true,
          logging: true,
          extra: {
            ...baseOptions.extra,
            connectionLimit: 5,
          },
        };

      case "test":
        return {
          type: "sqlite",
          database: `${config.database}_test.db`,
          synchronize: true,
          logging: false,
        };

      case "production":
        return {
          ...baseOptions,
          synchronize: false,
          logging: false,
          extra: {
            ...baseOptions.extra,
            connectionLimit: 20,
            ssl: true,
            acquireTimeout: 30000,
            timeout: 30000,
          },
        };

      default:
        return baseOptions;
    }
  }

  /**
   * Validate database configuration
   */
  static validateConfig(config: DatabaseConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.host) {
      errors.push("Database host is required");
    }

    if (!config.port || config.port < 1 || config.port > 65535) {
      errors.push("Valid database port is required");
    }

    if (!config.username) {
      errors.push("Database username is required");
    }

    if (!config.database) {
      errors.push("Database name is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get database health check query
   */
  static getHealthCheckQuery(): string {
    return "SELECT 1 as health_check";
  }

  /**
   * Get database version query
   */
  static getVersionQuery(): string {
    return "SELECT VERSION() as version";
  }

  /**
   * Get connection statistics query
   */
  static getConnectionStatsQuery(): string {
    return `
      SELECT 
        VARIABLE_NAME,
        VARIABLE_VALUE
      FROM INFORMATION_SCHEMA.GLOBAL_STATUS 
      WHERE VARIABLE_NAME IN (
        'Threads_connected',
        'Threads_running',
        'Max_used_connections',
        'Connections',
        'Uptime'
      )
    `;
  }

  /**
   * Get table information query
   */
  static getTableInfoQuery(tableName: string): string {
    return `
      SELECT 
        TABLE_NAME,
        TABLE_ROWS,
        DATA_LENGTH,
        INDEX_LENGTH,
        CREATE_TIME,
        UPDATE_TIME
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = ?
    `;
  }
}
