import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { CustomerDomainService } from '../../domain/services/customer.domain.service';
import { CustomerUpdatedEvent } from '../../domain/events/customer-updated.event';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';

/**
 * UpdateCustomerUseCase
 * 
 * This use case handles the update of existing customers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService
  ) {}

  /**
   * Updates an existing customer.
   * @param id The ID of the customer to update.
   * @param updateCustomerDto The data for updating the customer.
   * @returns Updated customer response
   */
  async execute(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    // 1. Find existing customer
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // 2. Check if customer can be edited
    if (!this.customerDomainService.canEditCustomer(existingCustomer)) {
      throw new BadRequestException('Customer cannot be edited at this time');
    }

    // 3. Validate update data using domain service
    const validation = this.customerDomainService.validateCustomerUpdateData(updateCustomerDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 4. If email is being changed, check for conflict
    if (updateCustomerDto.email && updateCustomerDto.email !== existingCustomer.email) {
      const customerWithSameEmail = await this.customerRepository.findByEmail(updateCustomerDto.email);
      if (customerWithSameEmail) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    // 5. Normalize update data
    const normalizedData = this.customerDomainService.normalizeCustomerData(updateCustomerDto);

    // 6. Track which fields are being updated
    const updatedFields = Object.keys(normalizedData).filter(key => 
      normalizedData[key] !== undefined && normalizedData[key] !== existingCustomer[key]
    );

    // 7. Update customer in repository
    const updatedCustomer = await this.customerRepository.update(id, normalizedData);

    // 8. Raise domain event
    const customerUpdatedEvent = new CustomerUpdatedEvent(updatedCustomer, updatedFields);
    // In a real application, you would publish this event to an event bus
    // this.eventBus.publish(customerUpdatedEvent);

    // 9. Return response
    return CustomerResponseDto.fromDomain(updatedCustomer);
  }
}
