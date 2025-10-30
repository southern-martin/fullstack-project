import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { SellerModule } from './domain/modules/seller.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ExternalServicesModule } from './infrastructure/external/external-services.module';
import { WinstonLoggerModule } from '@fullstack-project/shared-infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule, // Global Winston logging
    CacheModule,
    ExternalServicesModule,
    DatabaseModule,
    SellerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
