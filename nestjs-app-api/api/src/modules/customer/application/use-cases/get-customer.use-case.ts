import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { PaginationDto } from '../../../../shared/dto';

/**
 * GetCustomerUseCase
 * 
 * This use case handles the retrieval of customer information.
 * It orchestrates the domain logic and persistence (repository).
 */
@Injectable()
export class GetCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface
  ) {}

  /**
   * Retrieves a customer by their ID.
   * @param id The customer ID.
   * @returns The customer response DTO.
   * @throws NotFoundException if the customer is not found.
   */
  async getById(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return CustomerResponseDto.fromDomain(customer);
  }

  /**
   * Retrieves a customer by their email address.
   * @param email The customer email address.
   * @returns The customer response DTO.
   * @throws NotFoundException if the customer is not found.
   */
  async getByEmail(email: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return CustomerResponseDto.fromDomain(customer);
  }

  /**
   * Retrieves all customers with pagination.
   * @param paginationDto Pagination parameters.
   * @returns A paginated list of customer response DTOs.
   */
  async getAll(paginationDto: PaginationDto): Promise<{ customers: CustomerResponseDto[]; total: number }> {
    const result = await this.customerRepository.findAll(paginationDto);
    return {
      customers: result.customers.map(customer => CustomerResponseDto.fromDomain(customer)),
      total: result.total,
    };
  }

  /**
   * Retrieves all active customers.
   * @returns A list of active customer response DTOs.
   */
  async getActive(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findActive();
    return customers.map(customer => CustomerResponseDto.fromDomain(customer));
  }

  /**
   * Searches customers by search term.
   * @param searchTerm The search term to match against name or email.
   * @param paginationDto Pagination parameters.
   * @returns A paginated list of matching customer response DTOs.
   */
  async search(searchTerm: string, paginationDto: PaginationDto): Promise<{ customers: CustomerResponseDto[]; total: number }> {
    const result = await this.customerRepository.search(searchTerm, paginationDto);
    return {
      customers: result.customers.map(customer => CustomerResponseDto.fromDomain(customer)),
      total: result.total,
    };
  }

  /**
   * Retrieves the total count of customers.
   * @returns An object containing the total count.
   */
  async getCount(): Promise<{ count: number }> {
    const count = await this.customerRepository.count();
    return { count };
  }

  /**
   * Retrieves the count of active customers.
   * @returns An object containing the active count.
   */
  async getActiveCount(): Promise<{ count: number }> {
    const count = await this.customerRepository.countActive();
    return { count };
  }

  /**
   * Retrieves customers by date range.
   * @param startDate Start date for the range.
   * @param endDate End date for the range.
   * @returns A list of customer response DTOs created within the date range.
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findByDateRange(startDate, endDate);
    return customers.map(customer => CustomerResponseDto.fromDomain(customer));
  }

  /**
   * Retrieves customers by location.
   * @param location Location criteria.
   * @returns A list of customer response DTOs matching the location criteria.
   */
  async getByLocation(location: { city?: string; state?: string; country?: string }): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findByLocation(location);
    return customers.map(customer => CustomerResponseDto.fromDomain(customer));
  }
}
