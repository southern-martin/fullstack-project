import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthDomainService } from "../domain/services/auth.domain.service";
import { DatabaseModule } from "../infrastructure/database/database.module";
import { JwtStrategy } from "../infrastructure/strategies/jwt.strategy";
import { LoginUseCase } from "./use-cases/login.use-case";
import { RegisterUseCase } from "./use-cases/register.use-case";
import { ValidateTokenUseCase } from "./use-cases/validate-token.use-case";

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "your-secret-key"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthDomainService,
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
    JwtStrategy,
  ],
  exports: [
    AuthDomainService,
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
  ],
})
export class ApplicationModule {}






