import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepositoryInterface } from "../../domain/repositories/customer.repository.interface";

@Injectable()
export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}

  async create(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }> {
    const queryBuilder = this.customerRepository.createQueryBuilder("customer");

    if (search) {
      queryBuilder.where(
        "customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [customers, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("customer.createdAt", "DESC")
      .getManyAndCount();

    return { customers, total };
  }

  async findById(id: number): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { email } });
  }

  async findActive(): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { isActive: true } });
  }

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.customerRepository.count();
  }
}







