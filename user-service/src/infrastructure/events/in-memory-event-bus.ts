import { Injectable } from "@nestjs/common";
import { EventBusInterface } from "../../domain/events/event-bus.interface";

/**
 * In-Memory Event Bus Implementation
 * Simple implementation for development/testing
 * In production, replace with RabbitMQ, Kafka, or EventEmitter2
 */
@Injectable()
export class InMemoryEventBus implements EventBusInterface {
  private handlers: Map<string, Array<(event: any) => Promise<void>>> =
    new Map();

  /**
   * Publish a domain event
   * @param event - The domain event to publish
   */
  async publish(event: any): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    console.log(`[EventBus] Publishing event: ${eventName}`, {
      timestamp: new Date().toISOString(),
      eventData: event,
    });

    // Execute all handlers for this event type
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(
          `[EventBus] Error handling event ${eventName}:`,
          error
        );
        // Don't throw - continue processing other handlers
      }
    }
  }

  /**
   * Publish multiple domain events
   * @param events - Array of domain events to publish
   */
  async publishAll(events: any[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Subscribe a handler to a specific event type
   * @param eventName - The name of the event to subscribe to
   * @param handler - The handler function to execute
   */
  subscribe(
    eventName: string,
    handler: (event: any) => Promise<void>
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  /**
   * Clear all handlers (useful for testing)
   */
  clearHandlers(): void {
    this.handlers.clear();
  }
}
