import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Use Cases
import { CreateCustomerUseCase } from "./use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "./use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "./use-cases/get-customer.use-case";
import { UpdateCustomerUseCase } from "./use-cases/update-customer.use-case";

// Domain Services
import { CustomerDomainService } from "../domain/services/customer.domain.service";

// Infrastructure Modules
import { DatabaseModule } from "../infrastructure/database/database.module";

// Infrastructure Implementations
import { CustomerRepository } from "../infrastructure/database/typeorm/repositories/customer.repository";
import { RedisEventBus } from "../infrastructure/events/redis-event-bus";

/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [ConfigModule, DatabaseModule],
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
      provide: "CustomerRepositoryInterface",
      useClass: CustomerRepository,
    },

    // Event Bus Implementation
    {
      provide: "IEventBus",
      useClass: RedisEventBus,
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

    // Export event bus for controllers
    "IEventBus",
  ],
})
export class ApplicationModule {}
