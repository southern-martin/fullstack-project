import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';

/**
 * Cache Module
 *
 * Global module providing Redis caching functionality.
 * Available throughout the application.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CacheModule {}
