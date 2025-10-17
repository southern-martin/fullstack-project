import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Clean Architecture Modules
import { InterfacesModule } from "./interfaces/interfaces.module";

// TypeORM Entities (Infrastructure Layer)
import { UserTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user.typeorm.entity";
import { RoleTypeOrmEntity } from "./infrastructure/database/typeorm/entities/role.typeorm.entity";

/**
 * Main Application Module
 * Follows Clean Architecture principles
 * Orchestrates all layers through the Interfaces module
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "user_service_db",
      entities: [UserTypeOrmEntity, RoleTypeOrmEntity],
      synchronize: false, // Disabled to prevent schema conflicts - use migrations instead
      logging: process.env.NODE_ENV === "development",
      migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"],
      migrationsRun: process.env.NODE_ENV === "production",
    }),

    // Clean Architecture Layers (only import Interfaces module)
    InterfacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
