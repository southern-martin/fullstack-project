import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserTypeOrmEntity } from "./user.typeorm.entity";

/**
 * User Profile TypeORM Entity
 * Infrastructure layer - stores additional user information
 * One-to-One relationship with User entity
 */
@Entity("user_profiles")
export class UserProfileTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", unique: true })
  userId: number;

  @OneToOne(() => UserTypeOrmEntity)
  @JoinColumn({ name: "user_id" })
  user: UserTypeOrmEntity;

  @Column({ type: "date", nullable: true, name: "date_of_birth" })
  dateOfBirth: Date;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: "json", nullable: true })
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @Column({ type: "json", nullable: true })
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };

  @Column({ type: "json", nullable: true })
  preferences: Record<string, any>;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
