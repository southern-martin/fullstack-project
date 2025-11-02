import { Module } from '@nestjs/common';
import { SellerController } from '../../interfaces/http/seller.controller';
import { ApplicationModule } from '../../application/application.module';
import { JwtDecoder } from '../../infrastructure/auth/jwt-decoder.service';

/**
 * Seller Module
 * Domain module that orchestrates the seller feature
 * 
 * Uses Clean Architecture with ApplicationModule providing use cases
 */
@Module({
  imports: [ApplicationModule],
  controllers: [SellerController],
  providers: [JwtDecoder],
  exports: [ApplicationModule],
})
export class SellerModule {}
