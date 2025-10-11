import { Injectable, Logger } from "@nestjs/common";
import {
  BaseEvent,
  EventHandler,
  EventBus as IEventBus,
} from "../interfaces/event.interface";

/**
 * Event Bus Service
 * Manages event-driven communication between services
 */
@Injectable()
export class EventBusService implements IEventBus {
  private readonly logger = new Logger(EventBusService.name);
  private readonly eventHandlers = new Map<string, EventHandler[]>();
  private readonly eventHistory: BaseEvent[] = [];
  private readonly maxHistorySize = 1000;
  private isRunning = false;
  private totalEventsPublished = 0;

  /**
   * Start the event bus
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn("Event bus is already running");
      return;
    }

    this.isRunning = true;
    this.logger.log("🚀 Event bus started");
  }

  /**
   * Stop the event bus
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn("Event bus is not running");
      return;
    }

    this.isRunning = false;
    this.logger.log("🛑 Event bus stopped");
  }

  /**
   * Publish an event
   */
  async publish<T extends BaseEvent>(event: T): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn("Event bus is not running, cannot publish event");
      return;
    }

    try {
      // Add to event history
      this.addToHistory(event);
      this.totalEventsPublished++;

      // Get handlers for this event type
      const handlers = this.eventHandlers.get(event.eventType) || [];

      if (handlers.length === 0) {
        this.logger.debug(
          `No handlers found for event type: ${event.eventType}`
        );
        return;
      }

      this.logger.debug(
        `Publishing event: ${event.eventType} to ${handlers.length} handlers`
      );

      // Execute handlers in parallel
      const handlerPromises = handlers.map((handler) =>
        this.executeHandler(handler, event)
      );

      await Promise.allSettled(handlerPromises);

      this.logger.debug(`Event ${event.eventType} published successfully`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventType}:`, error);
      throw error;
    }
  }

  /**
   * Publish multiple events
   */
  async publishBatch<T extends BaseEvent>(events: T[]): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn("Event bus is not running, cannot publish events");
      return;
    }

    this.logger.debug(`Publishing batch of ${events.length} events`);

    const publishPromises = events.map((event) => this.publish(event));
    await Promise.allSettled(publishPromises);
  }

  /**
   * Subscribe to an event type
   */
  subscribe<T extends BaseEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }

    const handlers = this.eventHandlers.get(eventType)!;

    // Check if handler is already subscribed
    const existingHandler = handlers.find((h) => h === handler);
    if (existingHandler) {
      this.logger.warn(
        `Handler already subscribed to event type: ${eventType}`
      );
      return;
    }

    // Add handler with priority sorting
    handlers.push(handler);
    handlers.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    this.logger.debug(`Handler subscribed to event type: ${eventType}`);
  }

  /**
   * Unsubscribe from an event type
   */
  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (!handlers) {
      this.logger.warn(`No handlers found for event type: ${eventType}`);
      return;
    }

    const index = handlers.indexOf(handler);
    if (index === -1) {
      this.logger.warn(`Handler not found for event type: ${eventType}`);
      return;
    }

    handlers.splice(index, 1);
    this.logger.debug(`Handler unsubscribed from event type: ${eventType}`);

    // Clean up empty event types
    if (handlers.length === 0) {
      this.eventHandlers.delete(eventType);
    }
  }

  /**
   * Get all subscribers for an event type
   */
  getSubscribers(eventType: string): EventHandler[] {
    return this.eventHandlers.get(eventType) || [];
  }

  /**
   * Get event bus status
   */
  getStatus(): {
    isRunning: boolean;
    totalEvents: number;
    subscribers: { [eventType: string]: number };
  } {
    const subscribers: { [eventType: string]: number } = {};

    for (const [eventType, handlers] of this.eventHandlers.entries()) {
      subscribers[eventType] = handlers.length;
    }

    return {
      isRunning: this.isRunning,
      totalEvents: this.totalEventsPublished,
      subscribers,
    };
  }

  /**
   * Get event history
   */
  getEventHistory(limit?: number): BaseEvent[] {
    const events = this.eventHistory.slice();
    return limit ? events.slice(-limit) : events;
  }

  /**
   * Clear event history
   */
  clearEventHistory(): void {
    this.eventHistory.length = 0;
    this.logger.debug("Event history cleared");
  }

  /**
   * Execute a handler with error handling
   */
  private async executeHandler<T extends BaseEvent>(
    handler: EventHandler<T>,
    event: T
  ): Promise<void> {
    try {
      await handler.handle(event);
    } catch (error) {
      this.logger.error(
        `Error in event handler for ${event.eventType}:`,
        error
      );
      // Don't re-throw to prevent one handler failure from affecting others
    }
  }

  /**
   * Add event to history
   */
  private addToHistory(event: BaseEvent): void {
    this.eventHistory.push(event);

    // Maintain history size limit
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalEvents: number;
    eventTypes: number;
    totalHandlers: number;
    historySize: number;
    isRunning: boolean;
  } {
    let totalHandlers = 0;
    for (const handlers of this.eventHandlers.values()) {
      totalHandlers += handlers.length;
    }

    return {
      totalEvents: this.totalEventsPublished,
      eventTypes: this.eventHandlers.size,
      totalHandlers,
      historySize: this.eventHistory.length,
      isRunning: this.isRunning,
    };
  }
}
