import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

/**
 * Initial Schema Migration for User Service
 * 
 * This migration creates the complete shared database schema used by both
 * User Service and Auth Service:
 * 
 * Tables:
 * - users: Core user accounts (email, password, profile info)
 * - roles: User roles (admin, user, etc.)
 * - permissions: Fine-grained permissions
 * - user_profiles: Extended user profile information
 * - user_roles: Many-to-many join table (users <-> roles)
 * - role_permissions: Many-to-many join table (roles <-> permissions)
 * 
 * Indexes:
 * - users: email (unique)
 * - roles: name (unique)
 * - permissions: name (unique), category, name
 * - user_profiles: user_id (unique)
 * 
 * Note: Uses programmatic index checks for MySQL compatibility
 */
export class InitialSchema1761569247548 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create users table
        const usersTableExists = await queryRunner.hasTable('users');
        if (!usersTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'users',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'email',
                            type: 'varchar',
                            length: '255',
                            isUnique: true,
                        },
                        {
                            name: 'password',
                            type: 'varchar',
                            length: '255',
                        },
                        {
                            name: 'first_name',
                            type: 'varchar',
                            length: '100',
                        },
                        {
                            name: 'last_name',
                            type: 'varchar',
                            length: '100',
                        },
                        {
                            name: 'phone',
                            type: 'varchar',
                            length: '20',
                            isNullable: true,
                        },
                        {
                            name: 'is_active',
                            type: 'tinyint',
                            default: 1,
                        },
                        {
                            name: 'is_email_verified',
                            type: 'tinyint',
                            default: 0,
                        },
                        {
                            name: 'last_login_at',
                            type: 'datetime',
                            isNullable: true,
                        },
                        {
                            name: 'password_changed_at',
                            type: 'datetime',
                            isNullable: true,
                        },
                        {
                            name: 'created_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                        },
                        {
                            name: 'updated_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                            onUpdate: 'CURRENT_TIMESTAMP',
                        },
                    ],
                }),
                true
            );
        }

        // 2. Create roles table
        const rolesTableExists = await queryRunner.hasTable('roles');
        if (!rolesTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'roles',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'name',
                            type: 'varchar',
                            length: '100',
                            isUnique: true,
                        },
                        {
                            name: 'description',
                            type: 'varchar',
                            length: '255',
                            isNullable: true,
                        },
                        {
                            name: 'is_active',
                            type: 'tinyint',
                            default: 1,
                        },
                        {
                            name: 'created_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                        },
                        {
                            name: 'updated_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                            onUpdate: 'CURRENT_TIMESTAMP',
                        },
                    ],
                }),
                true
            );
        }

        // 3. Create permissions table
        const permissionsTableExists = await queryRunner.hasTable('permissions');
        if (!permissionsTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'permissions',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'name',
                            type: 'varchar',
                            length: '100',
                            isUnique: true,
                        },
                        {
                            name: 'description',
                            type: 'varchar',
                            length: '255',
                            isNullable: true,
                        },
                        {
                            name: 'category',
                            type: 'varchar',
                            length: '50',
                        },
                        {
                            name: 'created_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                        },
                        {
                            name: 'updated_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                            onUpdate: 'CURRENT_TIMESTAMP',
                        },
                    ],
                }),
                true
            );
        }

        // 4. Create user_profiles table
        const userProfilesTableExists = await queryRunner.hasTable('user_profiles');
        if (!userProfilesTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'user_profiles',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'user_id',
                            type: 'int',
                            isUnique: true,
                        },
                        {
                            name: 'date_of_birth',
                            type: 'date',
                            isNullable: true,
                        },
                        {
                            name: 'bio',
                            type: 'text',
                            isNullable: true,
                        },
                        {
                            name: 'avatar',
                            type: 'varchar',
                            length: '255',
                            isNullable: true,
                        },
                        {
                            name: 'address',
                            type: 'json',
                            isNullable: true,
                        },
                        {
                            name: 'socialLinks',
                            type: 'json',
                            isNullable: true,
                        },
                        {
                            name: 'preferences',
                            type: 'json',
                            isNullable: true,
                        },
                        {
                            name: 'metadata',
                            type: 'json',
                            isNullable: true,
                        },
                        {
                            name: 'created_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                        },
                        {
                            name: 'updated_at',
                            type: 'datetime',
                            default: 'CURRENT_TIMESTAMP',
                            onUpdate: 'CURRENT_TIMESTAMP',
                        },
                    ],
                }),
                true
            );
        }

        // 5. Create user_roles join table
        const userRolesTableExists = await queryRunner.hasTable('user_roles');
        if (!userRolesTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'user_roles',
                    columns: [
                        {
                            name: 'user_id',
                            type: 'int',
                        },
                        {
                            name: 'role_id',
                            type: 'int',
                        },
                    ],
                }),
                true
            );
        }

        // 6. Create role_permissions join table
        const rolePermissionsTableExists = await queryRunner.hasTable('role_permissions');
        if (!rolePermissionsTableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'role_permissions',
                    columns: [
                        {
                            name: 'role_id',
                            type: 'int',
                        },
                        {
                            name: 'permission_id',
                            type: 'int',
                        },
                    ],
                }),
                true
            );
        }

        // 7. Create indexes for permissions table (category and name)
        const permissionCategoryIndexExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.statistics 
             WHERE table_schema = DATABASE() 
             AND table_name = 'permissions' 
             AND index_name = 'idx_category'`
        );
        if (permissionCategoryIndexExists[0].count === 0) {
            await queryRunner.createIndex(
                'permissions',
                new TableIndex({
                    name: 'idx_category',
                    columnNames: ['category'],
                })
            );
        }

        const permissionNameIndexExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.statistics 
             WHERE table_schema = DATABASE() 
             AND table_name = 'permissions' 
             AND index_name = 'idx_name'`
        );
        if (permissionNameIndexExists[0].count === 0) {
            await queryRunner.createIndex(
                'permissions',
                new TableIndex({
                    name: 'idx_name',
                    columnNames: ['name'],
                })
            );
        }

        // 8. Create foreign key for user_profiles -> users
        const userProfileFkExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.key_column_usage 
             WHERE table_schema = DATABASE() 
             AND table_name = 'user_profiles' 
             AND constraint_name = 'FK_user_profiles_user_id'`
        );
        if (userProfileFkExists[0].count === 0) {
            await queryRunner.createForeignKey(
                'user_profiles',
                new TableForeignKey({
                    name: 'FK_user_profiles_user_id',
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                })
            );
        }

        // 9. Create foreign keys for user_roles join table
        const userRolesUserFkExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.key_column_usage 
             WHERE table_schema = DATABASE() 
             AND table_name = 'user_roles' 
             AND constraint_name = 'FK_user_roles_user_id'`
        );
        if (userRolesUserFkExists[0].count === 0) {
            await queryRunner.createForeignKey(
                'user_roles',
                new TableForeignKey({
                    name: 'FK_user_roles_user_id',
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                })
            );
        }

        const userRolesRoleFkExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.key_column_usage 
             WHERE table_schema = DATABASE() 
             AND table_name = 'user_roles' 
             AND constraint_name = 'FK_user_roles_role_id'`
        );
        if (userRolesRoleFkExists[0].count === 0) {
            await queryRunner.createForeignKey(
                'user_roles',
                new TableForeignKey({
                    name: 'FK_user_roles_role_id',
                    columnNames: ['role_id'],
                    referencedTableName: 'roles',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                })
            );
        }

        // 10. Create foreign keys for role_permissions join table
        const rolePermissionsRoleFkExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.key_column_usage 
             WHERE table_schema = DATABASE() 
             AND table_name = 'role_permissions' 
             AND constraint_name = 'FK_role_permissions_role_id'`
        );
        if (rolePermissionsRoleFkExists[0].count === 0) {
            await queryRunner.createForeignKey(
                'role_permissions',
                new TableForeignKey({
                    name: 'FK_role_permissions_role_id',
                    columnNames: ['role_id'],
                    referencedTableName: 'roles',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                })
            );
        }

        const rolePermissionsPermissionFkExists = await queryRunner.query(
            `SELECT COUNT(*) as count FROM information_schema.key_column_usage 
             WHERE table_schema = DATABASE() 
             AND table_name = 'role_permissions' 
             AND constraint_name = 'FK_role_permissions_permission_id'`
        );
        if (rolePermissionsPermissionFkExists[0].count === 0) {
            await queryRunner.createForeignKey(
                'role_permissions',
                new TableForeignKey({
                    name: 'FK_role_permissions_permission_id',
                    columnNames: ['permission_id'],
                    referencedTableName: 'permissions',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        await queryRunner.dropForeignKey('role_permissions', 'FK_role_permissions_permission_id');
        await queryRunner.dropForeignKey('role_permissions', 'FK_role_permissions_role_id');
        await queryRunner.dropForeignKey('user_roles', 'FK_user_roles_role_id');
        await queryRunner.dropForeignKey('user_roles', 'FK_user_roles_user_id');
        await queryRunner.dropForeignKey('user_profiles', 'FK_user_profiles_user_id');

        // Drop indexes
        await queryRunner.dropIndex('permissions', 'idx_name');
        await queryRunner.dropIndex('permissions', 'idx_category');

        // Drop tables (in reverse order of creation)
        await queryRunner.dropTable('role_permissions');
        await queryRunner.dropTable('user_roles');
        await queryRunner.dropTable('user_profiles');
        await queryRunner.dropTable('permissions');
        await queryRunner.dropTable('roles');
        await queryRunner.dropTable('users');
    }

}
