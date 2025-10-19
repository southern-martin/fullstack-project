import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerTypeOrmEntity } from "./typeorm/entities/customer.typeorm.entity";
import { CustomerRepository } from "./typeorm/repositories/customer.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeOrmEntity])],
  providers: [
    {
      provide: "CustomerRepositoryInterface",
      useClass: CustomerRepository,
    },
  ],
  exports: [TypeOrmModule, "CustomerRepositoryInterface"],
})
export class DatabaseModule {}
