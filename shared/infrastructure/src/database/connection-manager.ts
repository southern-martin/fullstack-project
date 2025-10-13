import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "../logging/logger";

/**
 * Database Configuration
 */
export interface ConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: any[];
  synchronize?: boolean;
  logging?: boolean;
  ssl?: boolean;
  extra?: Record<string, any>;
}

/**
 * Connection Manager
 *
 * Manages database connections and provides connection pooling.
 */
export class ConnectionManager {
  private dataSource: DataSource | null = null;
  private logger: Logger;
  private config: ConnectionConfig;

  constructor(config: ConnectionConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    try {
      const dataSourceOptions: DataSourceOptions = {
        type: "mysql",
        host: this.config.host,
        port: this.config.port,
        username: this.config.username,
        password: this.config.password,
        database: this.config.database,
        entities: this.config.entities,
        synchronize: this.config.synchronize || false,
        logging: this.config.logging || false,
        ssl: this.config.ssl || false,
        extra: {
          connectionLimit: 10,
          acquireTimeout: 60000,
          timeout: 60000,
          ...this.config.extra,
        },
      };

      this.dataSource = new DataSource(dataSourceOptions);
      await this.dataSource.initialize();

      this.logger.info("Database connection initialized successfully", {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
      });
    } catch (error) {
      this.logger.error(
        "Failed to initialize database connection",
        error as Error
      );
      throw error;
    }
  }

  /**
   * Get data source
   */
  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error("Database connection not initialized");
    }
    return this.dataSource;
  }

  /**
   * Check if connection is active
   */
  isConnected(): boolean {
    return this.dataSource?.isInitialized || false;
  }

  /**
   * Get connection health
   */
  async getHealth(): Promise<{ status: string; details: any }> {
    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        return {
          status: "disconnected",
          details: { error: "Database connection not initialized" },
        };
      }

      // Test connection with a simple query
      await this.dataSource.query("SELECT 1");

      return {
        status: "connected",
        details: {
          host: this.config.host,
          port: this.config.port,
          database: this.config.database,
          isInitialized: this.dataSource.isInitialized,
        },
      };
    } catch (error) {
      return {
        status: "error",
        details: { error: (error as Error).message },
      };
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.logger.info("Database connection closed successfully");
      }
    } catch (error) {
      this.logger.error("Failed to close database connection", error as Error);
      throw error;
    }
  }

  /**
   * Execute raw query
   */
  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        throw new Error("Database connection not initialized");
      }

      return await this.dataSource.query(query, parameters);
    } catch (error) {
      this.logger.error("Failed to execute query", error as Error, {
        query,
        parameters,
      });
      throw error;
    }
  }

  /**
   * Start transaction
   */
  async startTransaction(): Promise<any> {
    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        throw new Error("Database connection not initialized");
      }

      return await this.dataSource.manager.transaction(async (manager) => {
        return manager;
      });
    } catch (error) {
      this.logger.error("Failed to start transaction", error as Error);
      throw error;
    }
  }

  /**
   * Get connection statistics
   */
  async getConnectionStats(): Promise<any> {
    try {
      if (!this.dataSource || !this.dataSource.isInitialized) {
        return null;
      }

      // Get connection pool statistics
      const stats = await this.dataSource.query(`
        SELECT 
          VARIABLE_NAME,
          VARIABLE_VALUE
        FROM INFORMATION_SCHEMA.GLOBAL_STATUS 
        WHERE VARIABLE_NAME IN (
          'Threads_connected',
          'Threads_running',
          'Max_used_connections',
          'Connections'
        )
      `);

      return stats.reduce((acc: any, row: any) => {
        acc[row.VARIABLE_NAME] = row.VARIABLE_VALUE;
        return acc;
      }, {});
    } catch (error) {
      this.logger.error("Failed to get connection statistics", error as Error);
      return null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ConnectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): ConnectionConfig {
    return { ...this.config };
  }
}

/**
 * Create connection manager
 */
export function createConnectionManager(
  config: ConnectionConfig,
  logger: Logger
): ConnectionManager {
  return new ConnectionManager(config, logger);
}
