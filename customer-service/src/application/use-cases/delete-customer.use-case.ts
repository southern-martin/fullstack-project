import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { CustomerDeletedEvent } from "../../domain/events/customer-deleted.event";
import { IEventBus } from "../../domain/events/event-bus.interface";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerDomainService } from "../../domain/services/customer.domain.service";

/**
 * Delete Customer Use Case
 * Application service that orchestrates the customer deletion process
 * Follows Clean Architecture principles
 */
@Injectable()
export class DeleteCustomerUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly customerDomainService: CustomerDomainService,
    @Inject("IEventBus")
    private readonly eventBus: IEventBus
  ) {
    this.logger.setContext(DeleteCustomerUseCase.name);
  }

  /**
   * Executes the delete customer use case
   * @param id - Customer ID
   */
  async execute(id: number): Promise<void> {
    this.logger.log(`Deleting customer ${id}`);

    try {
      // 1. Find existing customer
      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        this.logger.warn(`Customer not found: ${id}`);
        throw new NotFoundException("Customer not found");
      }

      // 2. Check if customer can be deleted (business rule)
      // Note: In a real application, you would check for related orders
      // For now, we'll assume we can delete if no active orders
      const hasAnyOrders = false; // This would come from an order service

      if (
        !this.customerDomainService.canDeleteCustomer(
          existingCustomer,
          hasAnyOrders
        )
      ) {
        this.logger.warn("Cannot delete customer with existing orders", {
          customerId: id,
        });
        throw new BadRequestException(
          "Cannot delete customer with existing orders"
        );
      }

      // 3. Delete customer from repository
      await this.customerRepository.delete(id);

      this.logger.log("Customer deleted successfully", {
        customerId: id,
        email: existingCustomer.email,
      });

      // 4. Publish CustomerDeletedEvent
      await this.eventBus.publish(
        new CustomerDeletedEvent(
          existingCustomer.id!,
          existingCustomer.email,
          existingCustomer.fullName
        )
      );

      this.logger.debug("CustomerDeletedEvent published", {
        customerId: id,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete customer ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
