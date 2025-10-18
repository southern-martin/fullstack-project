import { DomainEvent } from "@fullstack-project/shared-infrastructure";

/**
 * Customer Deleted Event
 * Triggered when a customer is soft-deleted or permanently removed
 * Used for: Cleanup services, analytics, compliance logging
 */
export class CustomerDeletedEvent extends DomainEvent {
  constructor(
    public readonly customerId: number,
    public readonly email: string,
    public readonly fullName: string
  ) {
    super("CustomerDeleted");
  }

  getEventData(): Record<string, any> {
    return {
      customerId: this.customerId,
      email: this.email,
      fullName: this.fullName,
      deletedAt: this.occurredOn,
    };
  }
}
