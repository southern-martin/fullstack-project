import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PermissionTypeOrmEntity } from "./permission.typeorm.entity";

/**
 * TypeORM Role Entity
 * Infrastructure layer - database representation
 * Maps to domain Role entity
 * MUST match Auth Service entity structure (shared database)
 */
@Entity("roles")
export class RoleTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => PermissionTypeOrmEntity, (permission) => permission.roles, {
    eager: false, // Set to false to use explicit relations loading
    cascade: false,
  })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissionEntities: PermissionTypeOrmEntity[];

  @Column({ default: true, name: "is_active" })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
