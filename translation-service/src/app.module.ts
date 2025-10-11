import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TranslationController } from "./api/translation.controller";
import { TranslationService } from "./application/services/translation.service";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { LanguageValueRepository } from "./infrastructure/repositories/language-value.repository";
import { LanguageRepository } from "./infrastructure/repositories/language.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DatabaseModule,
  ],
  controllers: [TranslationController, HealthController],
  providers: [
    TranslationService,
    {
      provide: "LanguageRepositoryInterface",
      useClass: LanguageRepository,
    },
    {
      provide: "LanguageValueRepositoryInterface",
      useClass: LanguageValueRepository,
    },
  ],
})
export class AppModule {}
