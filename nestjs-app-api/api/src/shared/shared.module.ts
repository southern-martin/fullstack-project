import { Module } from "@nestjs/common";
import { ValidationModule } from "./validation/validation.module";

@Module({
  imports: [ValidationModule],
  providers: [],
  exports: [ValidationModule],
})
export class SharedModule {}
