import { DomainEvent } from "@fullstack-project/shared-infrastructure";

/**
 * User Logged In Event
 * Triggered when a user successfully authenticates
 * Used for: Security monitoring, analytics, session tracking
 */
export class UserLoggedInEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
    public readonly timestamp: Date = new Date()
  ) {
    super("UserLoggedIn");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      email: this.email,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
