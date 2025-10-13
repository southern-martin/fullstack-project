import { Module } from '@nestjs/common';
import { CustomerDomainService } from '../domain/services/customer.domain.service';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { GetCustomerUseCase } from './use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from './use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './use-cases/delete-customer.use-case';

/**
 * CustomerApplicationModule
 * 
 * This module configures the application layer for the Customer module.
 * It provides all the use cases and domain services needed for customer operations.
 */
@Module({
  providers: [
    // Domain Services
    CustomerDomainService,
    
    // Use Cases
    CreateCustomerUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [
    // Domain Services
    CustomerDomainService,
    
    // Use Cases
    CreateCustomerUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
})
export class CustomerApplicationModule {}
