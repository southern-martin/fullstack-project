import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InterfacesModule } from "./interfaces/interfaces.module";
import { DatabaseModule } from "./infrastructure/database/database.module";

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
