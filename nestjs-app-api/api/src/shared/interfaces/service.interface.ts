/**
 * Service Definition Interface
 * Defines the structure of a service in the microservice-oriented architecture
 */
export interface ServiceDefinition {
  /** Unique service name */
  name: string;

  /** Service version */
  version: string;

  /** Service dependencies */
  dependencies: string[];

  /** Service endpoints */
  endpoints: string[];

  /** Health check function */
  healthCheck: () => Promise<boolean>;

  /** Service instance (for internal communication) */
  instance?: any;

  /** Service metadata */
  metadata?: {
    description?: string;
    tags?: string[];
    [key: string]: any;
  };
}

/**
 * Service Health Status Interface
 */
export interface ServiceHealthStatus {
  /** Service name */
  name: string;

  /** Health status */
  status: "healthy" | "unhealthy" | "unknown";

  /** Last health check timestamp */
  timestamp: Date;

  /** Service dependencies */
  dependencies: string[];

  /** Additional health information */
  details?: {
    uptime?: number;
    memory?: number;
    cpu?: number;
    [key: string]: any;
  };
}

/**
 * System Health Status Interface
 */
export interface SystemHealthStatus {
  /** Overall system status */
  status: "healthy" | "unhealthy" | "degraded";

  /** Individual service health statuses */
  services: ServiceHealthStatus[];

  /** System health timestamp */
  timestamp: Date;

  /** System metadata */
  metadata?: {
    totalServices?: number;
    healthyServices?: number;
    unhealthyServices?: number;
    [key: string]: any;
  };
}

/**
 * Service Module Interface
 * Interface that all service modules should implement
 */
export interface ServiceModule {
  /** Service name */
  readonly SERVICE_NAME: string;

  /** Service version */
  readonly VERSION: string;

  /** Service dependencies */
  readonly DEPENDENCIES: string[];

  /** Initialize service */
  initialize?(): Promise<void>;

  /** Cleanup service */
  cleanup?(): Promise<void>;
}

/**
 * Service Module Class Interface
 * Interface for service module classes with static properties
 */
export interface ServiceModuleClass {
  /** Service name */
  readonly SERVICE_NAME: string;

  /** Service version */
  readonly VERSION: string;

  /** Service dependencies */
  readonly DEPENDENCIES: string[];
}
