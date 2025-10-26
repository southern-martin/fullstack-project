import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { CustomerActivatedEvent } from "../../domain/events/customer-activated.event";
import { CustomerDeactivatedEvent } from "../../domain/events/customer-deactivated.event";
import { CustomerUpdatedEvent } from "../../domain/events/customer-updated.event";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerDomainService } from "../../domain/services/customer.domain.service";
import { CustomerResponseDto } from "../dto/customer-response.dto";
import { UpdateCustomerDto } from "../dto/update-customer.dto";

/**
 * Update Customer Use Case
 * Application service that orchestrates the customer update process
 * Follows Clean Architecture principles
 */
@Injectable()
export class UpdateCustomerUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {
    this.logger.setContext(UpdateCustomerUseCase.name);
  }

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
    this.logger.log(`Updating customer ${id}`, {
      customerId: id,
      fields: Object.keys(updateCustomerDto),
    });

    try {
      // 1. Find existing customer
      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        this.logger.warn(`Customer not found: ${id}`);
        throw new NotFoundException("Customer not found");
      }

      // 2. Convert dateOfBirth string to Date if provided
      const updateData: any = { ...updateCustomerDto };
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }

      // 3. Validate update data using domain service
      const validation =
        this.customerDomainService.validateCustomerUpdateData(updateData);
      if (!validation.isValid) {
        this.logger.warn("Update validation failed", {
          customerId: id,
          errors: validation.errors,
        });
        throw new BadRequestException(validation.errors.join(", "));
      }

      // 4. Check if email is being changed and if it already exists
      if (
        updateCustomerDto.email &&
        updateCustomerDto.email !== existingCustomer.email
      ) {
        const customerWithSameEmail = await this.customerRepository.findByEmail(
          updateCustomerDto.email
        );
        if (customerWithSameEmail) {
          this.logger.warn("Email already exists", {
            customerId: id,
            newEmail: updateCustomerDto.email,
            conflictingCustomerId: customerWithSameEmail.id,
          });
          throw new ConflictException("Email already exists");
        }
      }

      // 5. Validate preferences if provided
      if (updateCustomerDto.preferences !== undefined) {
        const preferencesValidation =
          this.customerDomainService.validatePreferences(
            updateCustomerDto.preferences
          );
        if (!preferencesValidation.isValid) {
          this.logger.warn("Preferences validation failed", {
            customerId: id,
            errors: preferencesValidation.errors,
          });
          throw new BadRequestException(preferencesValidation.errors.join(", "));
        }
      }

      // 6. Prepare update data
      const finalUpdateData: Partial<any> = {};

      if (updateData.email !== undefined)
        finalUpdateData.email = updateData.email;
      if (updateData.firstName !== undefined)
        finalUpdateData.firstName = updateData.firstName;
      if (updateData.lastName !== undefined)
        finalUpdateData.lastName = updateData.lastName;
      if (updateData.phone !== undefined)
        finalUpdateData.phone = updateData.phone;
      if (updateData.isActive !== undefined)
        finalUpdateData.isActive = updateData.isActive;
      if (updateData.address !== undefined)
        finalUpdateData.address = updateData.address;
      if (updateData.preferences !== undefined)
        finalUpdateData.preferences = updateData.preferences;
      if (updateData.dateOfBirth !== undefined)
        finalUpdateData.dateOfBirth = updateData.dateOfBirth;

      // 7. Update customer in repository
      const updatedCustomer = await this.customerRepository.update(
        id,
        finalUpdateData
      );

      this.logger.log("Customer updated successfully", {
        customerId: id,
        updatedFields: Object.keys(finalUpdateData),
      });

      // 8. Publish CustomerUpdatedEvent
      await this.eventBus.publish(
        new CustomerUpdatedEvent(updatedCustomer, existingCustomer)
      );

      this.logger.debug("CustomerUpdatedEvent published", {
        customerId: id,
      });

      // 9. Publish activation/deactivation events if isActive changed
      if (
        updateData.isActive !== undefined &&
        updateData.isActive !== existingCustomer.isActive
      ) {
        if (updateData.isActive) {
          await this.eventBus.publish(
            new CustomerActivatedEvent(updatedCustomer)
          );
          this.logger.log("Customer activated", { customerId: id });
        } else {
          await this.eventBus.publish(
            new CustomerDeactivatedEvent(updatedCustomer, "Updated by user")
          );
          this.logger.log("Customer deactivated", { customerId: id });
        }
      }

      // 10. Return response
      return this.mapToResponseDto(updatedCustomer);
    } catch (error) {
      this.logger.error(
        `Failed to update customer ${id}: ${error.message}`,
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
