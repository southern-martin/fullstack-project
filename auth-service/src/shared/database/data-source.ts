import { DataSource } from "typeorm";
import { Role } from "../../user/role.entity";
import { User } from "../../user/user.entity";

export const AuthDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "auth_service_db",
  entities: [User, Role],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  migrations: ["dist/migrations/*.js"],
  migrationsRun: false,
});








