import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleController } from "./application/controllers/role.controller";
import { UserController } from "./application/controllers/user.controller";
import { RoleService } from "./application/services/role.service";
import { UserService } from "./application/services/user.service";
import { Role } from "./domain/entities/role.entity";
import { User } from "./domain/entities/user.entity";
import { HealthController } from "./health/health.controller";
import { RoleRepository } from "./infrastructure/role.repository";
import { UserRepository } from "./infrastructure/user.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "user_service_db",
      entities: [User, Role],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UserController, RoleController, HealthController],
  providers: [
    UserService,
    RoleService,
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepository,
    },
    {
      provide: "RoleRepositoryInterface",
      useClass: RoleRepository,
    },
  ],
})
export class AppModule {}
