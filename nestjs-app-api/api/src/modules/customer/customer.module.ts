import { Module } from '@nestjs/common';
import { CustomerApplicationModule } from './application/application.module';
import { CustomerInfrastructureModule } from './infrastructure/infrastructure.module';
import { CustomerInterfacesModule } from './interfaces/interfaces.module';

/**
 * CustomerModule
 * 
 * This module integrates all layers of the Customer module following Clean Architecture principles:
 * - Application Layer: Use cases and domain services
 * - Infrastructure Layer: Repository implementations and external services
 * - Interfaces Layer: HTTP controllers and external interfaces
 */
@Module({
  imports: [
    CustomerApplicationModule,
    CustomerInfrastructureModule,
    CustomerInterfacesModule,
  ],
  exports: [
    CustomerApplicationModule,
    CustomerInfrastructureModule,
  ],
})
export class CustomerModule {}
