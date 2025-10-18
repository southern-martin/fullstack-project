import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Customer } from "../entities/customer.entity";

/**
 * Customer Activated Event
 * Triggered when a customer is activated (isActive: true)
 * Used for: Enable services, notifications, restore access
 */
export class CustomerActivatedEvent extends DomainEvent {
  constructor(public readonly customer: Customer) {
    super("CustomerActivated");
  }

  getEventData(): Record<string, any> {
    return {
      customerId: this.customer.id,
      email: this.customer.email,
      fullName: this.customer.fullName,
      activatedAt: this.occurredOn,
    };
  }
}
