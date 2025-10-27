import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

// TypeORM Entities
import { PermissionTypeOrmEntity } from "./infrastructure/database/typeorm/entities/permission.typeorm.entity";
import { RoleTypeOrmEntity } from "./infrastructure/database/typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user.typeorm.entity";

// Logging
import { WinstonLoggerModule } from "@shared/infrastructure/logging";

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
      ignoreEnvFile: !!process.env.DB_HOST, // If DB_HOST is set (Docker), ignore .env file
    }),

    // Structured Logging
    WinstonLoggerModule,

    // Database
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "shared_user",
      password: process.env.DB_PASSWORD || "shared_password_2024",
      database: process.env.DB_NAME || "shared_user_db",
      entities: [UserTypeOrmEntity, RoleTypeOrmEntity, PermissionTypeOrmEntity],
      synchronize: false, // CRITICAL: Disabled - use migrations for schema changes (shared DB with User Service)
      migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"],
      migrationsRun: true, // Auto-run pending migrations on startup
      logging: false, // Disable TypeORM default logging, use Winston instead
      maxQueryExecutionTime: 1000, // Log slow queries > 1s
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
