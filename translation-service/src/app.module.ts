import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Shared Infrastructure
import { WinstonLoggerModule } from "@shared/infrastructure/logging/winston-logger.module";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

/**
 * Main application module for the Translation Service.
 * Configures global settings, database connection, and integrates
 * the Clean Architecture layers (Application, Infrastructure, Interfaces).
 */
@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Structured Logging
    WinstonLoggerModule,

    // Infrastructure (Database)
    DatabaseModule,

    // Clean Architecture Layers
    ApplicationModule,
    InterfacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
