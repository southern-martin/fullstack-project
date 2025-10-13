import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

// Clean Architecture Modules
import { AuthApplicationModule } from "./application/application.module";
import { AuthInfrastructureModule } from "./infrastructure/infrastructure.module";
import { AuthInterfacesModule } from "./interfaces/interfaces.module";

// JWT Strategy
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    AuthApplicationModule,
    AuthInfrastructureModule,
    AuthInterfacesModule,
  ],
  providers: [JwtStrategy],
  exports: [AuthApplicationModule],
})
export class AuthModule {}
