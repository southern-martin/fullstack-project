import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionTypeOrmEntity } from "./typeorm/entities/permission.typeorm.entity";
import { RoleTypeOrmEntity } from "./typeorm/entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "./typeorm/entities/user.typeorm.entity";
import { RoleRepository } from "./typeorm/repositories/role.repository";
import { UserRepository } from "./typeorm/repositories/user.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 3306),
        username: configService.get<string>("DB_USERNAME", "root"),
        password: configService.get<string>("DB_PASSWORD", ""),
        database: configService.get<string>("DB_NAME", "auth_service_db"),
        entities: [
          UserTypeOrmEntity,
          RoleTypeOrmEntity,
          PermissionTypeOrmEntity,
        ],
        synchronize: configService.get<string>("NODE_ENV") === "development",
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      RoleTypeOrmEntity,
      PermissionTypeOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepository,
    },
    {
      provide: "RoleRepositoryInterface",
      useClass: RoleRepository,
    },
  ],
  exports: ["UserRepositoryInterface", "RoleRepositoryInterface"],
})
export class DatabaseModule {}
