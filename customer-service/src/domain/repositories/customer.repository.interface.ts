import { Customer } from "../entities/customer.entity";

export interface CustomerRepositoryInterface {
  create(customer: Customer): Promise<Customer>;
  findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }>;
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findActive(): Promise<Customer[]>;
  update(id: number, customer: Partial<Customer>): Promise<Customer>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}

