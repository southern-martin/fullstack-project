import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CustomerController } from "./api/customer.controller";
import { CustomerService } from "./application/services/customer.service";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { CustomerRepository } from "./infrastructure/repositories/customer.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DatabaseModule,
  ],
  controllers: [CustomerController, HealthController],
  providers: [
    CustomerService,
    {
      provide: "CustomerRepositoryInterface",
      useClass: CustomerRepository,
    },
  ],
})
export class AppModule {}
