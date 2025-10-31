import { Module } from '@nestjs/common';
import { SellerController } from '../../interfaces/http/seller.controller';
import { SellerService } from '../services/seller.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ExternalServicesModule } from '../../infrastructure/external/external-services.module';
import { CacheModule } from '../../infrastructure/cache/cache.module';
import { JwtDecoder } from '../../infrastructure/auth/jwt-decoder.service';

@Module({
  imports: [DatabaseModule, ExternalServicesModule, CacheModule],
  controllers: [SellerController],
  providers: [SellerService, JwtDecoder],
  exports: [SellerService],
})
export class SellerModule {}
