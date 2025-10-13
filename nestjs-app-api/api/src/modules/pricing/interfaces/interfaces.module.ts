import { Module } from '@nestjs/common';
import { PricingController } from './controllers/pricing.controller';

/**
 * PricingInterfacesModule
 * 
 * This module configures the interfaces layer for the Pricing module.
 * It provides all the HTTP controllers and external interfaces.
 */
@Module({
  controllers: [
    PricingController,
  ],
})
export class PricingInterfacesModule {}
