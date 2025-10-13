import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerDomainService } from "../../domain/services/customer.domain.service";
import { CreateCustomerDto } from "../dtos/create-customer.dto";
import { CustomerResponseDto } from "../dtos/customer-response.dto";

/**
 * Create Customer Use Case
 * Application service that orchestrates the customer creation process
 * Follows Clean Architecture principles
 */
@Injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService
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
    const customer = {
      email: createCustomerDto.email.toLowerCase(),
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      phone: createCustomerDto.phone,
      isActive: createCustomerDto.isActive ?? true,
      dateOfBirth: createCustomerDto.dateOfBirth
        ? new Date(createCustomerDto.dateOfBirth)
        : null,
      address: createCustomerDto.address,
      preferences: createCustomerDto.preferences,
    };

    // 5. Save customer in repository
    const savedCustomer = await this.customerRepository.create(customer);

    // 6. Return response
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
    };
  }
}
