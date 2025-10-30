import { Module } from '@nestjs/common';
import { SellerController } from '../../interfaces/http/seller.controller';
import { SellerService } from '../services/seller.service';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ExternalServicesModule } from '../../infrastructure/external/external-services.module';
import { CacheModule } from '../../infrastructure/cache/cache.module';

@Module({
  imports: [DatabaseModule, ExternalServicesModule, CacheModule],
  controllers: [SellerController],
  providers: [SellerService, SellerRepository],
  exports: [SellerService],
})
export class SellerModule {}
