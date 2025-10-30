import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserServiceClient } from './user-service.client';

/**
 * External Services Module
 *
 * Manages HTTP clients for external microservices.
 */
@Module({
  imports: [ConfigModule],
  providers: [UserServiceClient],
  exports: [UserServiceClient],
})
export class ExternalServicesModule {}
