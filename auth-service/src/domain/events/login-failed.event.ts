import { DomainEvent } from "@fullstack-project/shared-infrastructure";

/**
 * Login Failed Event
 * Triggered when a login attempt fails
 * Used for: Security monitoring, brute force detection, alerts
 */
export class LoginFailedEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly reason: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
    public readonly timestamp: Date = new Date()
  ) {
    super("LoginFailed");
  }

  getEventData(): Record<string, any> {
    return {
      email: this.email,
      reason: this.reason,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
