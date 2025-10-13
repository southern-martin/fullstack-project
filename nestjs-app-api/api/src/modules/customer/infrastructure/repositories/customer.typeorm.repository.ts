import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryInterface } from '../../domain/repositories/customer.repository.interface';
import { PaginationDto } from '../../../../shared/dto';

/**
 * CustomerTypeOrmRepository
 * 
 * This class provides the concrete TypeORM implementation for the CustomerRepositoryInterface.
 * It handles all database operations for customer entities.
 */
@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}

  async create(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }

  async findById(id: number): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({ 
      where: { email: email.toLowerCase() } 
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<{ customers: Customer[]; total: number }> {
    const [customers, total] = await this.customerRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    });

    return { customers, total };
  }

  async findActive(): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async search(searchTerm: string, paginationDto: PaginationDto): Promise<{ customers: Customer[]; total: number }> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    
    queryBuilder.where(
      '(customer.firstName LIKE :searchTerm OR customer.lastName LIKE :searchTerm OR customer.email LIKE :searchTerm)',
      { searchTerm: `%${searchTerm}%` }
    );

    const [customers, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy('customer.createdAt', 'DESC')
      .getManyAndCount();

    return { customers, total };
  }

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.customerRepository.count({
      where: { email: email.toLowerCase() }
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.customerRepository.count();
  }

  async countActive(): Promise<number> {
    return await this.customerRepository.count({
      where: { isActive: true }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByLocation(location: { city?: string; state?: string; country?: string }): Promise<Customer[]> {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer');
    
    if (location.city) {
      queryBuilder.andWhere('customer.address->>"$.city" = :city', { city: location.city });
    }
    
    if (location.state) {
      queryBuilder.andWhere('customer.address->>"$.state" = :state', { state: location.state });
    }
    
    if (location.country) {
      queryBuilder.andWhere('customer.address->>"$.country" = :country', { country: location.country });
    }

    return await queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .getMany();
  }
}
