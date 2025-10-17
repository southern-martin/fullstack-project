import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './database/typeorm/entities/user.typeorm.entity';
import { RoleTypeOrmEntity } from './database/typeorm/entities/role.typeorm.entity';
import { UserTypeOrmRepository } from './database/typeorm/repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from './database/typeorm/repositories/role.typeorm.repository';

/**
 * Infrastructure Module
 * 
 * This module configures all infrastructure layer dependencies including:
 * - Database entities and repositories
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
  ],
  exports: [
    'UserRepositoryInterface',
    'RoleRepositoryInterface',
  ],
})
export class InfrastructureModule {}
