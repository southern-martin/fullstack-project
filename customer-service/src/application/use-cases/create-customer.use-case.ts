import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
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
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {
    this.logger.setContext(CreateCustomerUseCase.name);
  }

  /**
   * Executes the create customer use case
   * @param createCustomerDto - Customer creation data
   * @returns Created customer response
   */
  async execute(
    createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    this.logger.log("Creating new customer", {
      email: createCustomerDto.email,
      hasPhone: !!createCustomerDto.phone,
      hasAddress: !!createCustomerDto.address,
      hasPreferences: !!createCustomerDto.preferences,
    });

    try {
      // 1. Validate input using domain service
      const validation =
        this.customerDomainService.validateCustomerCreationData(
          createCustomerDto
        );
      if (!validation.isValid) {
        this.logger.warn("Customer validation failed", {
          errors: validation.errors,
          email: createCustomerDto.email,
        });
        throw new BadRequestException(validation.errors.join(", "));
      }

      // 2. Check if customer email already exists
      const existingCustomer = await this.customerRepository.findByEmail(
        createCustomerDto.email
      );
      if (existingCustomer) {
        this.logger.warn("Customer email already exists", {
          email: createCustomerDto.email,
          existingCustomerId: existingCustomer.id,
        });
        throw new ConflictException("Email already exists");
      }

      // 3. Validate preferences if provided
      if (createCustomerDto.preferences) {
        const preferencesValidation =
          this.customerDomainService.validatePreferences(
            createCustomerDto.preferences
          );
        if (!preferencesValidation.isValid) {
          this.logger.warn("Preferences validation failed", {
            errors: preferencesValidation.errors,
            email: createCustomerDto.email,
          });
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

      this.logger.log("Customer created successfully", {
        customerId: savedCustomer.id,
        email: savedCustomer.email,
        fullName: savedCustomer.fullName,
      });

      // 6. Publish CustomerCreatedEvent
      await this.eventBus.publish(new CustomerCreatedEvent(savedCustomer));

      this.logger.debug("CustomerCreatedEvent published", {
        customerId: savedCustomer.id,
        email: savedCustomer.email,
      });

      // 7. Return response
      return this.mapToResponseDto(savedCustomer);
    } catch (error) {
      this.logger.error(
        `Failed to create customer: ${error.message}`,
        error.stack
      );
      throw error;
    }
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
