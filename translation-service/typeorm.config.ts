import { DataSource } from "typeorm";
import { config } from "dotenv";
import { LanguageTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/language.typeorm.entity";
import { LanguageValueTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/language-value.typeorm.entity";

// Load environment variables - prioritize .env.local for CLI usage
config({ path: ".env.local" });
config({ path: ".env" });

/**
 * TypeORM DataSource Configuration for Migrations
 * 
 * This configuration is used by TypeORM CLI for migration management.
 * Separate from the application's runtime TypeORM configuration.
 * 
 * Usage:
 * - Generate migration: npm run migration:generate -- MigrationName
 * - Run migrations: npm run migration:run
 * - Revert migration: npm run migration:revert
 * - Show migrations: npm run migration:show
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3312"),
  username: process.env.DB_USERNAME || "translation_user",
  password: process.env.DB_PASSWORD || "translation_password",
  database: process.env.DB_NAME || "translation_service_db",
  
  // Entity paths
  entities: [
    LanguageTypeOrmEntity,
    LanguageValueTypeOrmEntity,
  ],
  
  // Migration paths
  migrations: [
    "src/infrastructure/database/typeorm/migrations/*.ts",
  ],
  
  // Migration table name
  migrationsTableName: "typeorm_migrations",
  
  // Logging
  logging: process.env.NODE_ENV === "development",
  
  // Synchronize disabled for migrations approach
  synchronize: false,
});
