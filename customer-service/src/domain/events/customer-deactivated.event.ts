import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Customer } from "../entities/customer.entity";

/**
 * Customer Deactivated Event
 * Triggered when a customer is deactivated (isActive: false)
 * Used for: Disable services, notifications, suspend access
 */
export class CustomerDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly customer: Customer,
    public readonly reason?: string
  ) {
    super("CustomerDeactivated");
  }

  getEventData(): Record<string, any> {
    return {
      customerId: this.customer.id,
      email: this.customer.email,
      fullName: this.customer.fullName,
      reason: this.reason,
      deactivatedAt: this.occurredOn,
    };
  }
}
