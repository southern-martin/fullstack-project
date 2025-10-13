import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";
import { CustomerResponseDto } from "../dto/customer-response.dto";

/**
 * Get Customer Use Case
 * Application service that orchestrates the customer retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface
  ) {}

  /**
   * Executes the get customer by ID use case
   * @param id - Customer ID
   * @returns Customer response
   */
  async executeById(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return this.mapToResponseDto(customer);
  }

  /**
   * Executes the get customer by email use case
   * @param email - Customer email
   * @returns Customer response
   */
  async executeByEmail(email: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return this.mapToResponseDto(customer);
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
    const { customers, total } = await this.customerRepository.findAll(
      page,
      limit,
      search
    );

    const totalPages = Math.ceil(total / limit);

    return {
      customers: customers.map((customer) => this.mapToResponseDto(customer)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Executes the get active customers use case
   * @returns Active customers
   */
  async executeActive(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findActive();
    return customers.map((customer) => this.mapToResponseDto(customer));
  }

  /**
   * Executes the get customer count use case
   * @returns Customer count
   */
  async executeCount(): Promise<{ count: number }> {
    const count = await this.customerRepository.count();
    return { count };
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
