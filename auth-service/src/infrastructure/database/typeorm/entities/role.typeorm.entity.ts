import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * TypeORM Role Entity
 * Infrastructure layer - database representation
 * Maps to domain Role entity
 */
@Entity("roles")
@Index(["name"], { unique: true })
export class RoleTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("simple-array", { default: "" })
  permissions: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  priority: number;

  @Column({ type: "json", nullable: true })
  users: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
