import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { CustomerDomainService } from '../../domain/services/customer.domain.service';
import { CustomerCreatedEvent } from '../../domain/events/customer-created.event';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';

/**
 * CreateCustomerUseCase
 * 
 * This use case handles the creation of new customers.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService
  ) {}

  /**
   * Creates a new customer.
   * @param createCustomerDto The data for creating the customer.
   * @returns Created customer response
   */
  async execute(createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    // 1. Validate input using domain service
    const validation = this.customerDomainService.validateCustomerCreationData(createCustomerDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // 2. Check if customer with email already exists
    const existingCustomer = await this.customerRepository.findByEmail(createCustomerDto.email);
    if (existingCustomer) {
      throw new ConflictException(`Customer with email ${createCustomerDto.email} already exists`);
    }

    // 3. Normalize customer data
    const normalizedData = this.customerDomainService.normalizeCustomerData(createCustomerDto);

    // 4. Create customer entity
    const customer = new Customer();
    customer.email = normalizedData.email;
    customer.firstName = normalizedData.firstName;
    customer.lastName = normalizedData.lastName;
    customer.phone = normalizedData.phone;
    customer.isActive = normalizedData.isActive ?? true;
    customer.dateOfBirth = normalizedData.dateOfBirth;
    customer.address = normalizedData.address;
    customer.preferences = normalizedData.preferences || {};

    // 5. Save customer in repository
    const savedCustomer = await this.customerRepository.create(customer);

    // 6. Raise domain event
    const customerCreatedEvent = new CustomerCreatedEvent(savedCustomer);
    // In a real application, you would publish this event to an event bus
    // this.eventBus.publish(customerCreatedEvent);

    // 7. Return response
    return CustomerResponseDto.fromDomain(savedCustomer);
  }
}
