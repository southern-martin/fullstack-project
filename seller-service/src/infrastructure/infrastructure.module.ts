import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ExternalServicesModule } from './external/external-services.module';
import { CacheModule } from './cache/cache.module';

/**
 * Infrastructure Module
 * 
 * Aggregates all infrastructure layer modules:
 * - DatabaseModule: TypeORM entities and repositories
 * - ExternalServicesModule: UserServiceClient, etc.
 * - CacheModule: Redis caching service
 */
@Module({
  imports: [DatabaseModule, ExternalServicesModule, CacheModule],
  exports: [DatabaseModule, ExternalServicesModule, CacheModule],
})
export class InfrastructureModule {}
