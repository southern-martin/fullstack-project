import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './database/typeorm/entities/user.typeorm.entity';
import { RoleTypeOrmEntity } from './database/typeorm/entities/role.typeorm.entity';
import { UserTypeOrmRepository } from './database/typeorm/repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from './database/typeorm/repositories/role.typeorm.repository';
import { InMemoryEventBus } from './events/in-memory-event-bus';

/**
 * Infrastructure Module
 * 
 * This module configures all infrastructure layer dependencies including:
 * - Database entities and repositories
 * - Event bus for domain events
 * - External service integrations
 * - Infrastructure-specific configurations
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleTypeOrmRepository,
    },
    {
      provide: 'EventBusInterface',
      useClass: InMemoryEventBus,
    },
  ],
  exports: [
    'UserRepositoryInterface',
    'RoleRepositoryInterface',
    'EventBusInterface',
  ],
})
export class InfrastructureModule {}
