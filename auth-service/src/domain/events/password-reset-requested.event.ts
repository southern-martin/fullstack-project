import { DomainEvent } from "@shared/infrastructure";

/**
 * Password Reset Requested Event
 * Triggered when a user requests a password reset
 * Used for: Email notifications, security monitoring
 */
export class PasswordResetRequestedEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly ipAddress?: string,
    public readonly timestamp: Date = new Date()
  ) {
    super("PasswordResetRequested");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      email: this.email,
      ipAddress: this.ipAddress,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
