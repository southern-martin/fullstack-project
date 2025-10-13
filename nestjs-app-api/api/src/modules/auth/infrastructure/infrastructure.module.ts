import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from '../domain/entities/user.entity';
import { Role } from '../domain/entities/role.entity';

// Repository Implementations
import { UserTypeOrmRepository } from './repositories/user.typeorm.repository';
import { RoleTypeOrmRepository } from './repositories/role.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [
    UserTypeOrmRepository,
    RoleTypeOrmRepository,
  ],
  exports: [
    UserTypeOrmRepository,
    RoleTypeOrmRepository,
  ],
})
export class AuthInfrastructureModule {}
