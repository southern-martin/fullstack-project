import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Carrier } from '../domain/entities/carrier.entity';

// Repository Implementations
import { CarrierTypeOrmRepository } from './repositories/carrier.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrier]),
  ],
  providers: [
    CarrierTypeOrmRepository,
  ],
  exports: [
    CarrierTypeOrmRepository,
  ],
})
export class CarrierInfrastructureModule {}
