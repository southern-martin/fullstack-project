import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { Customer } from "../entities/customer.entity";

/**
 * Customer Updated Event
 * Triggered when a customer's data is modified
 * Used for: Cache invalidation, sync services, analytics
 */
export class CustomerUpdatedEvent extends DomainEvent {
  constructor(
    public readonly customer: Customer,
    public readonly previousData: Partial<Customer>
  ) {
    super("CustomerUpdated");
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
      updatedAt: this.customer.updatedAt,
      previousData: this.previousData,
      changes: this.getChanges(),
    };
  }

  private getChanges(): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {};

    Object.keys(this.previousData).forEach((key) => {
      const oldValue = this.previousData[key as keyof Customer];
      const newValue = this.customer[key as keyof Customer];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[key] = { old: oldValue, new: newValue };
      }
    });

    return changes;
  }
}
