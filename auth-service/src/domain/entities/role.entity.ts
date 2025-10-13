import { Column, Entity } from "typeorm";
import { BaseEntity } from "../shared/interfaces/base.entity";

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  permissions: string[];

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;
}








