import { Module } from "@nestjs/common";

// Controllers
import { AuthController } from "./controllers/auth.controller";

@Module({
  controllers: [AuthController],
})
export class AuthInterfacesModule {}
