import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../../domain/entities/role.entity";
import { User } from "../../domain/entities/user.entity";
import {
  ROLE_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from "../../domain/tokens/repository.tokens";
import { RoleRepository } from "../repositories/role.repository";
import { UserRepository } from "../repositories/user.repository";

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
        entities: [User, Role],
        synchronize: configService.get<string>("NODE_ENV") === "development",
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: RoleRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, ROLE_REPOSITORY_TOKEN],
})
export class DatabaseModule {}
