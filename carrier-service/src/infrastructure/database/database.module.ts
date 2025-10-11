import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Carrier } from "../../domain/entities/carrier.entity";

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
        entities: [Carrier],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Carrier]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}




