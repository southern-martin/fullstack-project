import { DomainEvent } from '../../../../shared/kernel';
import { Customer } from '../entities/customer.entity';

/**
 * CustomerUpdatedEvent
 * 
 * This event is raised when an existing customer is updated in the system.
 * It contains the updated customer information and what fields were changed.
 */
export class CustomerUpdatedEvent extends DomainEvent {
  constructor(
    public readonly customer: Customer,
    public readonly updatedFields: string[],
    public readonly updatedAt: Date = new Date()
  ) {
    super();
  }

  getEventName(): string {
    return 'CustomerUpdated';
  }

  getAggregateId(): string {
    return this.customer.id.toString();
  }

  getEventData(): any {
    return {
      customerId: this.customer.id,
      email: this.customer.email,
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      phone: this.customer.phone,
      isActive: this.customer.isActive,
      dateOfBirth: this.customer.dateOfBirth,
      address: this.customer.address,
      preferences: this.customer.preferences,
      updatedFields,
      updatedAt: this.updatedAt,
    };
  }
}
