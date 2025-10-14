import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarrierTypeOrmEntity } from "./typeorm/entities/carrier.typeorm.entity";
import { CarrierRepository } from "./typeorm/repositories/carrier.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USERNAME", "root"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "carrier_service_db"),
        entities: [CarrierTypeOrmEntity],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([CarrierTypeOrmEntity]),
  ],
  providers: [
    {
      provide: "CarrierRepositoryInterface",
      useClass: CarrierRepository,
    },
  ],
  exports: [TypeOrmModule, "CarrierRepositoryInterface"],
})
export class DatabaseModule {}
