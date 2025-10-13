import { DomainEvent } from '../../../../shared/kernel';
import { Customer } from '../entities/customer.entity';

/**
 * CustomerDeletedEvent
 * 
 * This event is raised when a customer is deleted from the system.
 * It contains the customer information that was deleted.
 */
export class CustomerDeletedEvent extends DomainEvent {
  constructor(
    public readonly customer: Customer,
    public readonly deletedAt: Date = new Date()
  ) {
    super();
  }

  getEventName(): string {
    return 'CustomerDeleted';
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
      deletedAt: this.deletedAt,
    };
  }
}
