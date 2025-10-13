import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { CustomerDomainService } from '../../domain/services/customer.domain.service';
import { CustomerDeletedEvent } from '../../domain/events/customer-deleted.event';

/**
 * DeleteCustomerUseCase
 * 
 * This use case handles the deletion of customers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService
  ) {}

  /**
   * Deletes a customer.
   * @param id The ID of the customer to delete.
   * @throws NotFoundException if the customer is not found.
   * @throws BadRequestException if the customer cannot be deleted due to business rules.
   */
  async execute(id: number): Promise<void> {
    // 1. Find existing customer
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // 2. Check if customer can be deleted based on business rules
    if (!this.customerDomainService.canDeleteCustomer(existingCustomer)) {
      throw new BadRequestException('Customer cannot be deleted due to business rules');
    }

    // 3. Delete customer from repository
    await this.customerRepository.delete(id);

    // 4. Raise domain event
    const customerDeletedEvent = new CustomerDeletedEvent(existingCustomer);
    // In a real application, you would publish this event to an event bus
    // this.eventBus.publish(customerDeletedEvent);
  }
}
