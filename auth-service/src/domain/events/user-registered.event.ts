import { DomainEvent } from "@fullstack-project/shared-infrastructure";

/**
 * User Registered Event
 * Triggered when a new user successfully registers
 * Used for: Welcome emails, analytics, security monitoring
 */
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly registrationIp?: string,
    public readonly registrationDate: Date = new Date()
  ) {
    super("UserRegistered");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      registrationIp: this.registrationIp,
      registrationDate: this.registrationDate.toISOString(),
    };
  }
}
