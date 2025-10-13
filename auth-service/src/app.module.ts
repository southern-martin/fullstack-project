import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

// TypeORM Entities
import { RoleTypeOrmEntity } from "./infrastructure/database/typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user.typeorm.entity";

/**
 * Main Application Module
 * Follows Clean Architecture principles
 * Orchestrates all layers
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "auth_service_db",
      entities: [UserTypeOrmEntity, RoleTypeOrmEntity],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),

    // Clean Architecture Layers
    ApplicationModule,
    InfrastructureModule,
    InterfacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
