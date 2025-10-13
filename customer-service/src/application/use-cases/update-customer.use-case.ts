import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerDomainService } from "../../domain/services/customer.domain.service";
import { CustomerResponseDto } from "../dtos/customer-response.dto";
import { UpdateCustomerDto } from "../dtos/update-customer.dto";

/**
 * Update Customer Use Case
 * Application service that orchestrates the customer update process
 * Follows Clean Architecture principles
 */
@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService
  ) {}

  /**
   * Executes the update customer use case
   * @param id - Customer ID
   * @param updateCustomerDto - Update data
   * @returns Updated customer response
   */
  async execute(
    id: number,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<CustomerResponseDto> {
    // 1. Find existing customer
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException("Customer not found");
    }

    // 2. Validate update data using domain service
    const validation =
      this.customerDomainService.validateCustomerUpdateData(updateCustomerDto);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(", "));
    }

    // 3. Check if email is being changed and if it already exists
    if (
      updateCustomerDto.email &&
      updateCustomerDto.email !== existingCustomer.email
    ) {
      const customerWithSameEmail = await this.customerRepository.findByEmail(
        updateCustomerDto.email
      );
      if (customerWithSameEmail) {
        throw new ConflictException("Email already exists");
      }
    }

    // 4. Validate preferences if provided
    if (updateCustomerDto.preferences !== undefined) {
      const preferencesValidation =
        this.customerDomainService.validatePreferences(
          updateCustomerDto.preferences
        );
      if (!preferencesValidation.isValid) {
        throw new BadRequestException(preferencesValidation.errors.join(", "));
      }
    }

    // 5. Prepare update data
    const updateData: Partial<any> = {};

    if (updateCustomerDto.email !== undefined)
      updateData.email = updateCustomerDto.email;
    if (updateCustomerDto.firstName !== undefined)
      updateData.firstName = updateCustomerDto.firstName;
    if (updateCustomerDto.lastName !== undefined)
      updateData.lastName = updateCustomerDto.lastName;
    if (updateCustomerDto.phone !== undefined)
      updateData.phone = updateCustomerDto.phone;
    if (updateCustomerDto.isActive !== undefined)
      updateData.isActive = updateCustomerDto.isActive;
    if (updateCustomerDto.address !== undefined)
      updateData.address = updateCustomerDto.address;
    if (updateCustomerDto.preferences !== undefined)
      updateData.preferences = updateCustomerDto.preferences;

    // Convert dateOfBirth string to Date if provided
    if (updateCustomerDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateCustomerDto.dateOfBirth);
    }

    // 6. Update customer in repository
    const updatedCustomer = await this.customerRepository.update(
      id,
      updateData
    );

    // 7. Return response
    return this.mapToResponseDto(updatedCustomer);
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
