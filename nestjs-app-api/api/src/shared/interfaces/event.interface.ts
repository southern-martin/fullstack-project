import { v4 as uuidv4 } from "uuid";

/**
 * Base Event Interface
 * All domain events should extend this interface
 */
export interface BaseEvent {
  /** Unique event ID */
  readonly eventId: string;

  /** Event type identifier */
  readonly eventType: string;

  /** Event version */
  readonly eventVersion: string;

  /** Event timestamp */
  readonly timestamp: Date;

  /** Event source (service that published the event) */
  readonly source: string;

  /** Event correlation ID for tracing */
  correlationId?: string;

  /** Event metadata */
  metadata?: {
    userId?: string;
    tenantId?: string;
    [key: string]: any;
  };
}

/**
 * Event Handler Interface
 * Interface for handling domain events
 */
export interface EventHandler<T extends BaseEvent = BaseEvent> {
  /** Handle the event */
  handle(event: T): void | Promise<void>;

  /** Event type this handler can process */
  readonly eventType: string;

  /** Handler priority (higher number = higher priority) */
  readonly priority?: number;
}

/**
 * Event Publisher Interface
 * Interface for publishing domain events
 */
export interface EventPublisher {
  /** Publish an event */
  publish<T extends BaseEvent>(event: T): void | Promise<void>;

  /** Publish multiple events */
  publishBatch<T extends BaseEvent>(events: T[]): void | Promise<void>;
}

/**
 * Event Subscriber Interface
 * Interface for subscribing to domain events
 */
export interface EventSubscriber {
  /** Subscribe to an event type */
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void;

  /** Unsubscribe from an event type */
  unsubscribe(eventType: string, handler: EventHandler): void;

  /** Get all subscribers for an event type */
  getSubscribers(eventType: string): EventHandler[];
}

/**
 * Abstract Base Event Class
 * Base class for all domain events
 */
export abstract class BaseEventClass implements BaseEvent {
  readonly eventId: string;
  readonly timestamp: Date;
  correlationId?: string;
  metadata?: { [key: string]: any };

  constructor(
    public readonly eventType: string,
    public readonly eventVersion: string,
    public readonly source: string,
    correlationId?: string,
    metadata?: { [key: string]: any }
  ) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.correlationId = correlationId;
    this.metadata = metadata;
  }
}

/**
 * Event Bus Interface
 * Main interface for event-driven communication
 */
export interface EventBus extends EventPublisher, EventSubscriber {
  /** Start the event bus */
  start(): Promise<void>;

  /** Stop the event bus */
  stop(): Promise<void>;

  /** Get event bus status */
  getStatus(): {
    isRunning: boolean;
    totalEvents: number;
    subscribers: { [eventType: string]: number };
  };
}
