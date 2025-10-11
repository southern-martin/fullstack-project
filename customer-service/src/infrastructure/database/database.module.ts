import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "../../domain/entities/customer.entity";

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
        database: configService.get("DB_NAME", "customer_service_db"),
        entities: [Customer],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Customer]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}




