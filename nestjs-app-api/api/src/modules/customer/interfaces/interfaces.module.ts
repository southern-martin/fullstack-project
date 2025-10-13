import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';

/**
 * CustomerInterfacesModule
 * 
 * This module configures the interfaces layer for the Customer module.
 * It provides all the HTTP controllers and external interfaces.
 */
@Module({
  controllers: [
    CustomerController,
  ],
})
export class CustomerInterfacesModule {}
