import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Shared Infrastructure
import { WinstonLoggerModule } from "@shared/infrastructure/logging/winston-logger.module";
import { RedisCacheService } from "@shared/infrastructure";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { CustomerTypeOrmEntity } from "./infrastructure/database/typeorm/entities/customer.typeorm.entity";
import { InterfacesModule } from "./interfaces/interfaces.module";

/**
 * Main Application Module
 * Follows Clean Architecture principles
 * Orchestrates all layers
 * @Global makes RedisCacheService available to all modules without explicit imports
 */
@Global()
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      ignoreEnvFile: !!process.env.DB_HOST, // Ignore .env if DB_HOST env var exists (Docker)
    }),

    // Structured Logging
    WinstonLoggerModule,

    // Database Connection
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "customer_service_db",
      entities: [CustomerTypeOrmEntity],
      migrations: ["dist/infrastructure/database/typeorm/migrations/*.js"],
      migrationsRun: true,
      synchronize: false,
      logging: false, // Disable SQL logging (use Winston for structured logs)
    }),

    // Infrastructure Layer
    DatabaseModule,

    // Clean Architecture Layers
    ApplicationModule,
    InterfacesModule,
  ],
  controllers: [],
  providers: [
    // Global Redis Cache Service
    {
      provide: RedisCacheService,
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get("REDIS_HOST", "shared-redis");
        const redisPort = configService.get("REDIS_PORT", 6379);
        const redisPassword = configService.get("REDIS_PASSWORD", "");
        const redisUrl = redisPassword
          ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
          : `redis://${redisHost}:${redisPort}`;
        
        return new RedisCacheService({
          redisUrl,
          prefix: configService.get("REDIS_KEY_PREFIX", "customer:"),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService], // Export globally
})
export class AppModule {}
