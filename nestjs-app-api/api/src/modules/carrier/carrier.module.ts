import { Module } from '@nestjs/common';

// Clean Architecture Modules
import { CarrierApplicationModule } from './application/application.module';
import { CarrierInfrastructureModule } from './infrastructure/infrastructure.module';
import { CarrierInterfacesModule } from './interfaces/interfaces.module';

@Module({
  imports: [
    CarrierApplicationModule,
    CarrierInfrastructureModule,
    CarrierInterfacesModule,
  ],
  exports: [CarrierApplicationModule],
})
export class CarrierModule {}
