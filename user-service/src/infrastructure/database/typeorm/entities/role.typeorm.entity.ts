import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../shared/kernel';
import { UserRoleTypeOrmEntity } from './user-role.typeorm.entity';

/**
 * Role TypeORM Entity
 * 
 * This entity represents the database table structure for roles.
 * It's separate from the domain entity to maintain Clean Architecture principles.
 */
@Entity('roles')
@Index(['name'], { unique: true })
@Index(['isActive'])
@Index(['createdAt'])
export class RoleTypeOrmEntity extends BaseEntity {
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  permissions: string[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  // Relations
  @OneToMany(() => UserRoleTypeOrmEntity, userRole => userRole.role)
  userRoles: UserRoleTypeOrmEntity[];
}
