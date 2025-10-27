import { DataSource } from "typeorm";
import { CustomerTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/customer.typeorm.entity";
import * as dotenv from "dotenv";

// Load .env.local for CLI usage (localhost connection)
dotenv.config({ path: ".env.local" });

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3309,
  username: process.env.DB_USERNAME || "customer_user",
  password: process.env.DB_PASSWORD || "customer_password",
  database: process.env.DB_NAME || "customer_service_db",
  entities: [CustomerTypeOrmEntity],
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
