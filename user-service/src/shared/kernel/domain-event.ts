/**
 * Domain Event Base Class
 * 
 * This abstract class provides the base structure for domain events.
 * It follows Clean Architecture principles by being framework-agnostic.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date = new Date();

  abstract getEventName(): string;
  abstract getAggregateId(): string;
  abstract getEventData(): any;
}
