import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerCreatedEvent } from "../../domain/events/customer-created.event";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerDomainService } from "../../domain/services/customer.domain.service";
import { CreateCustomerDto } from "../dto/create-customer.dto";
import { CustomerResponseDto } from "../dto/customer-response.dto";

/**
 * Create Customer Use Case
 * Application service that orchestrates the customer creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {}

  /**
   * Executes the create customer use case
   * @param createCustomerDto - Customer creation data
   * @returns Created customer response
   */
  async execute(
    createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    // 1. Validate input using domain service
    const validation =
      this.customerDomainService.validateCustomerCreationData(
        createCustomerDto
      );
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 2. Check if customer email already exists
    const existingCustomer = await this.customerRepository.findByEmail(
      createCustomerDto.email
    );
    if (existingCustomer) {
      throw new ConflictException("Email already exists");
    }

    // 3. Validate preferences if provided
    if (createCustomerDto.preferences) {
      const preferencesValidation =
        this.customerDomainService.validatePreferences(
          createCustomerDto.preferences
        );
      if (!preferencesValidation.isValid) {
        throw new BadRequestException(preferencesValidation.errors.join(", "));
      }
    }

    // 4. Create customer entity
    const customer = new Customer({
      email: createCustomerDto.email.toLowerCase(),
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      phone: createCustomerDto.phone,
      isActive: createCustomerDto.isActive ?? true,
      dateOfBirth: createCustomerDto.dateOfBirth
        ? new Date(createCustomerDto.dateOfBirth)
        : undefined,
      address: createCustomerDto.address,
      preferences: createCustomerDto.preferences,
    });

    // 5. Save customer in repository
    const savedCustomer = await this.customerRepository.create(customer);

    // 6. Publish CustomerCreatedEvent
    await this.eventBus.publish(new CustomerCreatedEvent(savedCustomer));

    // 7. Return response
    return this.mapToResponseDto(savedCustomer);
  }

  /**
   * Maps customer entity to response DTO
   * @param customer - Customer entity
   * @returns Customer response DTO
   */
  private mapToResponseDto(customer: any): CustomerResponseDto {
    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      isActive: customer.isActive,
      dateOfBirth: customer.dateOfBirth,
      address: customer.address,
      preferences: customer.preferences,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      get fullName() {
        return `${customer.firstName} ${customer.lastName}`.trim();
      },
    };
  }
}
