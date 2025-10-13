import { Module } from '@nestjs/common';

// Controllers
import { CarrierController } from './controllers/carrier.controller';
import { HealthController } from './controllers/health.controller';

// Use Cases (from application layer)
import { CreateCarrierUseCase } from '../application/use-cases/create-carrier.use-case';
import { GetCarrierUseCase } from '../application/use-cases/get-carrier.use-case';
import { UpdateCarrierUseCase } from '../application/use-cases/update-carrier.use-case';
import { DeleteCarrierUseCase } from '../application/use-cases/delete-carrier.use-case';

// Domain Services
import { CarrierDomainService } from '../domain/services/carrier.domain.service';

// Infrastructure
import { CarrierRepository } from '../infrastructure/repositories/carrier.repository';

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  controllers: [
    CarrierController,
    HealthController,
  ],
  providers: [
    // Use Cases
    CreateCarrierUseCase,
    GetCarrierUseCase,
    UpdateCarrierUseCase,
    DeleteCarrierUseCase,

    // Domain Services
    CarrierDomainService,

    // Repository Implementation
    {
      provide: 'CarrierRepositoryInterface',
      useClass: CarrierRepository,
    },
  ],
})
export class InterfacesModule {}
