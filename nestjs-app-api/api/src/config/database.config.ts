import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 7777,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "nestjs-app",
  autoLoadEntities: true, // ← Let NestJS auto-discover entities from modules
  synchronize: false, // Temporarily disabled to avoid schema conflicts
  logging: process.env.NODE_ENV === "development",
  migrations: [__dirname + "/../infrastructure/database/migrations/*{.ts,.js}"],
  migrationsRun: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};
