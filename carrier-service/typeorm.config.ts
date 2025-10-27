import { DataSource } from "typeorm";
import { CarrierTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/carrier.typeorm.entity";
import * as dotenv from "dotenv";

// Load .env.local for CLI usage (localhost connection)
dotenv.config({ path: ".env.local" });

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3310,
  username: process.env.DB_USERNAME || "carrier_user",
  password: process.env.DB_PASSWORD || "carrier_password",
  database: process.env.DB_NAME || "carrier_service_db",
  entities: [CarrierTypeOrmEntity],
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
