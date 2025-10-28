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
import { UserProfileTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user-profile.typeorm.entity";
import { UserTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user.typeorm.entity";

// Logging
import { WinstonLoggerModule } from "@shared/infrastructure/logging";

// Consul Configuration
import { createTypeOrmConsulConfig } from "./infrastructure/config/typeorm-consul.config";

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
      ignoreEnvFile: !!process.env.DB_HOST, // Ignore .env if DB_HOST env var exists (Docker)
    }),

    // Structured Logging
    WinstonLoggerModule,

    // Database - Configured from Consul KV Store
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return await createTypeOrmConsulConfig();
      },
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
