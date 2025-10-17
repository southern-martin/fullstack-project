import { DomainEvent } from "@shared/infrastructure";

/**
 * Password Changed Event
 * Triggered when a user's password is changed
 * Used for: Security notifications, audit logging
 */
export class PasswordChangedEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly changedBy: "user" | "admin" | "system",
    public readonly timestamp: Date = new Date()
  ) {
    super("PasswordChanged");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      email: this.email,
      changedBy: this.changedBy,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
