import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

// TypeORM Entities
import { LanguageValue } from "./domain/entities/language-value.entity";
import { Language } from "./domain/entities/language.entity";

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

    // Database
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "translation_service_db",
      entities: [Language, LanguageValue],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),

    // Clean Architecture Layers
    ApplicationModule,
    InterfacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
