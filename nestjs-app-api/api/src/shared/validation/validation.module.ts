import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../modules/users/domain/entities/user.entity";
import { IsEmailUniqueConstraint } from "./unique-email.decorator";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [IsEmailUniqueConstraint],
  exports: [IsEmailUniqueConstraint],
})
export class ValidationModule {}

