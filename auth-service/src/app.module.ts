import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationModule } from "./application/application.module";
import { AuthController } from "./interfaces/controllers/auth.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ApplicationModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
