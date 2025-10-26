import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WinstonLoggerService } from "@shared/infrastructure/logging/winston-logger.service";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerResponseDto } from "../dto/customer-response.dto";

/**
 * Get Customer Use Case
 * Application service that orchestrates the customer retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetCustomerUseCase {
  private readonly logger = new WinstonLoggerService();

  constructor(
    @Inject("CustomerRepositoryInterface")
    private readonly customerRepository: CustomerRepositoryInterface
  ) {
    this.logger.setContext(GetCustomerUseCase.name);
  }

  /**
   * Executes the get customer by ID use case
   * @param id - Customer ID
   * @returns Customer response
   */
  async executeById(id: number): Promise<CustomerResponseDto> {
    this.logger.debug(`Getting customer by ID: ${id}`);

    try {
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        this.logger.warn(`Customer not found: ${id}`);
        throw new NotFoundException("Customer not found");
      }

      this.logger.debug("Customer retrieved successfully", {
        customerId: id,
        email: customer.email,
      });

      return this.mapToResponseDto(customer);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to get customer ${id}: ${error.message}`,
          error.stack
        );
      }
      throw error;
    }
  }

  /**
   * Executes the get customer by email use case
   * @param email - Customer email
   * @returns Customer response
   */
  async executeByEmail(email: string): Promise<CustomerResponseDto> {
    this.logger.debug(`Getting customer by email: ${email}`);

    try {
      const customer = await this.customerRepository.findByEmail(email);
      if (!customer) {
        this.logger.warn(`Customer not found with email: ${email}`);
        throw new NotFoundException("Customer not found");
      }

      this.logger.debug("Customer retrieved successfully", {
        customerId: customer.id,
        email: customer.email,
      });

      return this.mapToResponseDto(customer);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to get customer by email ${email}: ${error.message}`,
          error.stack
        );
      }
      throw error;
    }
  }

  /**
   * Executes the get all customers use case
   * @param page - Page number
   * @param limit - Items per page
   * @param search - Search term
   * @returns Customers and pagination info
   */
  async executeAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    customers: CustomerResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.debug("Getting all customers", { page, limit, search });

    try {
      const { customers, total } = await this.customerRepository.findPaginated(
        page,
        limit,
        search
      );

      const totalPages = Math.ceil(total / limit);

      this.logger.debug("Customers retrieved successfully", {
        total,
        returned: customers.length,
        page,
        totalPages,
      });

      return {
        customers: customers.map((customer) => this.mapToResponseDto(customer)),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get all customers: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Executes the get active customers use case
   * @returns Active customers
   */
  async executeActive(): Promise<CustomerResponseDto[]> {
    this.logger.debug("Getting active customers");

    try {
      const customers = await this.customerRepository.findActive();

      this.logger.debug("Active customers retrieved successfully", {
        count: customers.length,
      });

      return customers.map((customer) => this.mapToResponseDto(customer));
    } catch (error) {
      this.logger.error(
        `Failed to get active customers: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Executes the get customer count use case
   * @returns Customer count
   */
  async executeCount(): Promise<{ count: number }> {
    this.logger.debug("Getting customer count");

    try {
      const count = await this.customerRepository.count();

      this.logger.debug("Customer count retrieved successfully", { count });

      return { count };
    } catch (error) {
      this.logger.error(
        `Failed to get customer count: ${error.message}`,
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
