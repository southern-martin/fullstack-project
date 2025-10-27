import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleTypeOrmEntity } from "./role.typeorm.entity";

/**
 * TypeORM Permission Entity
 * Infrastructure layer - database representation
 * Maps to domain Permission entity
 */
@Entity("permissions")
@Index(["category"])
@Index(["name"])
export class PermissionTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ length: 50 })
  category: string;

  @ManyToMany(() => RoleTypeOrmEntity, (role) => role.permissionEntities)
  roles: RoleTypeOrmEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
