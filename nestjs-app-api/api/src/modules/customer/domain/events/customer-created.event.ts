import { DomainEvent } from '../../../../shared/kernel';
import { Customer } from '../entities/customer.entity';

/**
 * CustomerCreatedEvent
 * 
 * This event is raised when a new customer is created in the system.
 * It contains all the relevant information about the newly created customer.
 */
export class CustomerCreatedEvent extends DomainEvent {
  constructor(
    public readonly customer: Customer,
    public readonly createdAt: Date = new Date()
  ) {
    super();
  }

  getEventName(): string {
    return 'CustomerCreated';
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
      createdAt: this.createdAt,
    };
  }
}
