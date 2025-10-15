import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LanguageValueTypeOrmEntity } from "./typeorm/entities/language-value.typeorm.entity";
import { LanguageTypeOrmEntity } from "./typeorm/entities/language.typeorm.entity";
import { LanguageValueRepository } from "./typeorm/repositories/language-value.repository";
import { LanguageRepository } from "./typeorm/repositories/language.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USERNAME", "root"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "translation_service_db"),
        entities: [LanguageTypeOrmEntity, LanguageValueTypeOrmEntity],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      LanguageTypeOrmEntity,
      LanguageValueTypeOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: "LanguageRepositoryInterface",
      useClass: LanguageRepository,
    },
    {
      provide: "LanguageValueRepositoryInterface",
      useClass: LanguageValueRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    "LanguageRepositoryInterface",
    "LanguageValueRepositoryInterface",
  ],
})
export class DatabaseModule {}
