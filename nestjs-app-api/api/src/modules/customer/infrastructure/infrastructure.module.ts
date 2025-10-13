import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerTypeOrmRepository } from './repositories/customer.typeorm.repository';
import { CustomerRepositoryInterface } from '../domain/repositories/customer.repository.interface';

/**
 * CustomerInfrastructureModule
 * 
 * This module configures the infrastructure layer for the Customer module.
 * It provides the concrete implementations of repositories and external services.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [
    {
      provide: CustomerRepositoryInterface,
      useClass: CustomerTypeOrmRepository,
    },
  ],
  exports: [
    CustomerRepositoryInterface,
  ],
})
export class CustomerInfrastructureModule {}
