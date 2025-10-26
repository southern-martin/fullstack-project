import { DomainEvent } from "@fullstack-project/shared-infrastructure";

/**
 * Event Bus Interface
 * Defines the contract for publishing domain events
 * Framework-independent interface for event dispatching
 */
export interface IEventBus {
  /**
   * Publish a domain event
   * @param event - The domain event to publish
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publish multiple domain events
   * @param events - Array of domain events to publish
   */
  publishAll(events: DomainEvent[]): Promise<void>;
}
