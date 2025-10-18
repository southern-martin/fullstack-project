import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Customer } from "../entities/customer.entity";

/**
 * Customer Created Event
 * Triggered when a new customer is created
 * Used for: CRM integration, analytics, invoice service, welcome emails
 */
export class CustomerCreatedEvent extends DomainEvent {
  constructor(public readonly customer: Customer) {
    super("CustomerCreated");
  }

  getEventData(): Record<string, any> {
    return {
      customerId: this.customer.id,
      email: this.customer.email,
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      fullName: this.customer.fullName,
      phone: this.customer.phone,
      isActive: this.customer.isActive,
      dateOfBirth: this.customer.dateOfBirth,
      address: this.customer.address,
      preferences: this.customer.preferences,
      createdAt: this.customer.createdAt,
    };
  }
}
