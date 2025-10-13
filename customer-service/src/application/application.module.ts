import { Module } from '@nestjs/common';

// Use Cases
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { GetCustomerUseCase } from './use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from './use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './use-cases/delete-customer.use-case';

// Domain Services
import { CustomerDomainService } from '../domain/services/customer.domain.service';

// Repository Interfaces (will be implemented in infrastructure)
import { CustomerRepositoryInterface } from '../domain/repositories/customer.repository.interface';

// Infrastructure Implementations
import { CustomerRepository } from '../infrastructure/repositories/customer.repository';

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
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

    // Repository Implementations
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
  ],
  exports: [
    // Export use cases for controllers
    CreateCustomerUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    
    // Export domain services
    CustomerDomainService,
  ],
})
export class ApplicationModule {}
