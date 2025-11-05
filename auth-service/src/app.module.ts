import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Clean Architecture Modules
import { ApplicationModule } from "./application/application.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { InterfacesModule } from "./interfaces/interfaces.module";

// Controllers
import { HealthController } from './interfaces/controllers/health.controller';

// TypeORM Entities
import { PermissionTypeOrmEntity } from "./infrastructure/database/typeorm/entities/permission.typeorm.entity";
import { RoleTypeOrmEntity } from "./infrastructure/database/typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./infrastructure/database/typeorm/entities/user.typeorm.entity";

// Logging
import { WinstonLoggerModule } from "@shared/infrastructure/logging";

/**
 * Main Application Module
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // TypeORM Database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserTypeOrmEntity,
        RoleTypeOrmEntity,
        PermissionTypeOrmEntity,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),

    // Clean Architecture Layers
    ApplicationModule,
    InfrastructureModule,
    InterfacesModule,

    // Logging
    WinstonLoggerModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [],
})
export class AppModule {}
