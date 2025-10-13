import { Module } from '@nestjs/common';

// Use Cases
import { CreateCarrierUseCase } from './use-cases/create-carrier.use-case';
import { GetCarrierUseCase } from './use-cases/get-carrier.use-case';
import { UpdateCarrierUseCase } from './use-cases/update-carrier.use-case';
import { DeleteCarrierUseCase } from './use-cases/delete-carrier.use-case';

// Domain Services
import { CarrierDomainService } from '../domain/services/carrier.domain.service';

// Repository Interfaces
import { CarrierRepositoryInterface } from '../domain/repositories/carrier.repository.interface';

// Infrastructure
import { CarrierTypeOrmRepository } from '../infrastructure/repositories/carrier.typeorm.repository';

// Shared Services
import { EventBusService } from '../../../shared/services/event-bus.service';

@Module({
  providers: [
    // Use Cases
    CreateCarrierUseCase,
    GetCarrierUseCase,
    UpdateCarrierUseCase,
    DeleteCarrierUseCase,

    // Domain Services
    CarrierDomainService,

    // Repository Implementations
    {
      provide: 'CarrierRepositoryInterface',
      useClass: CarrierTypeOrmRepository,
    },

    // Shared Services
    EventBusService,
  ],
  exports: [
    CreateCarrierUseCase,
    GetCarrierUseCase,
    UpdateCarrierUseCase,
    DeleteCarrierUseCase,
    CarrierDomainService,
  ],
})
export class CarrierApplicationModule {}
