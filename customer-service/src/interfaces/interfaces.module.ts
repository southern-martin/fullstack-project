import { Module } from '@nestjs/common';

// Controllers
import { CustomerController } from './controllers/customer.controller';
import { HealthController } from './controllers/health.controller';

// Use Cases (from application layer)
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../application/use-cases/get-customer.use-case';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../application/use-cases/delete-customer.use-case';

// Domain Services
import { CustomerDomainService } from '../domain/services/customer.domain.service';

// Infrastructure
import { CustomerRepository } from '../infrastructure/repositories/customer.repository';

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [
    CustomerController,
    HealthController,
  ],
  providers: [
    // Use Cases
    CreateCustomerUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,

    // Domain Services
    CustomerDomainService,

    // Repository Implementation
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
  ],
})
export class InterfacesModule {}
