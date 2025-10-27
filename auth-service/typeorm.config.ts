import { DataSource } from "typeorm";
import { UserTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/user.typeorm.entity";
import { RoleTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/role.typeorm.entity";
import { PermissionTypeOrmEntity } from "./src/infrastructure/database/typeorm/entities/permission.typeorm.entity";

/**
 * TypeORM DataSource Configuration for Auth Service
 * Used by TypeORM CLI for running migrations
 * 
 * IMPORTANT: Auth Service shares database with User Service
 * Database: shared_user_db (Port 3306)
 * Migration coordination required between both services
 */
export default new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "shared_user",
  password: "shared_password_2024",
  database: "shared_user_db",
  entities: [UserTypeOrmEntity, RoleTypeOrmEntity, PermissionTypeOrmEntity],
  migrations: ["src/infrastructure/database/typeorm/migrations/*.ts"],
  synchronize: false,
});
