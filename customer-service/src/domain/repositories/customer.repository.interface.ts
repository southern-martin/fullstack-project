import { PaginationDto } from "@shared/infrastructure";
import { Customer } from "../entities/customer.entity";

export interface CustomerRepositoryInterface {
  create(customer: Customer): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ customers: Customer[]; total: number }>;
  update(id: number, customer: Partial<Customer>): Promise<Customer>;
  delete(id: number): Promise<void>;
  findActive(): Promise<Customer[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }>;
}
