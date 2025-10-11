import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CarrierController } from "./api/carrier.controller";
import { CarrierService } from "./application/services/carrier.service";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { CarrierRepository } from "./infrastructure/repositories/carrier.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DatabaseModule,
  ],
  controllers: [CarrierController, HealthController],
  providers: [
    CarrierService,
    {
      provide: "CarrierRepositoryInterface",
      useClass: CarrierRepository,
    },
  ],
})
export class AppModule {}
