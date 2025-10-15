/**
 * Domain Event
 *
 * Base class for domain events following Domain-Driven Design principles.
 * Domain events represent something important that happened in the domain.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;
  public readonly eventType: string;

  constructor(eventType: string, eventId?: string) {
    this.eventType = eventType;
    this.eventId = eventId || this.generateEventId();
    this.occurredOn = new Date();
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return `${this.eventType}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  /**
   * Get event data as a plain object
   */
  abstract getEventData(): Record<string, any>;

  /**
   * Get event metadata
   */
  getEventMetadata(): Record<string, any> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      occurredOn: this.occurredOn.toISOString(),
      version: "1.0",
    };
  }

  /**
   * Serialize event to JSON
   */
  toJSON(): string {
    return JSON.stringify({
      metadata: this.getEventMetadata(),
      data: this.getEventData(),
    });
  }

  /**
   * Create event from JSON
   */
  static fromJSON<T extends DomainEvent>(
    this: new (...args: any[]) => T,
    json: string
  ): T {
    const parsed = JSON.parse(json);
    const event = new this(parsed.metadata.eventType, parsed.metadata.eventId);
    Object.assign(event, parsed.data);
    return event;
  }
}
