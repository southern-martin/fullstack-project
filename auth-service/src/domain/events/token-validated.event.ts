import { DomainEvent } from "@shared/infrastructure";

/**
 * Token Validated Event
 * Triggered when a JWT token is validated
 * Used for: Token usage tracking, session monitoring
 */
export class TokenValidatedEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly tokenId: string,
    public readonly timestamp: Date = new Date()
  ) {
    super("TokenValidated");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      tokenId: this.tokenId,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
