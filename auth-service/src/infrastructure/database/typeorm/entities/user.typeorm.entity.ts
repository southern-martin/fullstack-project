import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoleTypeOrmEntity } from "./role.typeorm.entity";

/**
 * TypeORM User Entity
 * Infrastructure layer - database representation
 * Maps to domain User entity
 */
@Entity("users")
@Index(["email"], { unique: true })
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true })
  lastFailedLoginAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  passwordChangedAt: Date;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ type: "json", nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ type: "json", nullable: true })
  preferences: Record<string, any>;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @ManyToMany(() => RoleTypeOrmEntity, { eager: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  roles: RoleTypeOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
