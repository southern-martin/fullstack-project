import { DataSource } from "typeorm";
import { UserTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/user.typeorm.entity";
import { RoleTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/role.typeorm.entity";
import { PermissionTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/permission.typeorm.entity";
import { UserProfileTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/user-profile.typeorm.entity";
import * as dotenv from "dotenv";

// Load .env.local for CLI usage (localhost connection)
dotenv.config({ path: ".env.local" });

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "shared_user",
  password: process.env.DB_PASSWORD || "shared_password_2024",
  database: process.env.DB_NAME || "shared_user_db",
  entities: [
    UserTypeOrmEntity,
    RoleTypeOrmEntity,
    PermissionTypeOrmEntity,
    UserProfileTypeOrmEntity,
  ],
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
