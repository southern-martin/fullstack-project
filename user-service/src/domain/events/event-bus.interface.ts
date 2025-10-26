/**
 * Event Bus Interface
 * Defines the contract for publishing domain events
 */
export interface IEventBus {
  /**
   * Publish a domain event
   * @param event - The domain event to publish
   */
  publish(event: any): Promise<void>;

  /**
   * Publish multiple domain events
   * @param events - Array of domain events to publish
   */
  publishAll(events: any[]): Promise<void>;
}
