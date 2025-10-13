import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// TypeORM Entities
import { UserTypeOrmEntity } from './database/typeorm/entities/user.typeorm.entity';
import { RoleTypeOrmEntity } from './database/typeorm/entities/role.typeorm.entity';

// Repository Implementations
import { UserTypeOrmRepository } from './database/typeorm/repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from './database/typeorm/repositories/role.typeorm.repository';

// Repository Interfaces
import { UserRepositoryInterface } from '../domain/repositories/user.repository.interface';
import { RoleRepositoryInterface } from '../domain/repositories/role.repository.interface';

/**
 * Infrastructure Module
 * Configures infrastructure layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
    ]),
  ],
  providers: [
    // Repository Implementations
    {
      provide: 'UserRepositoryInterface',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'RoleRepositoryInterface',
      useClass: RoleTypeOrmRepository,
    },
  ],
  exports: [
    // Export repository implementations
    'UserRepositoryInterface',
    'RoleRepositoryInterface',
  ],
})
export class InfrastructureModule {}
