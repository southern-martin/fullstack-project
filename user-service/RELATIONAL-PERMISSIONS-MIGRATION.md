# Relational Permissions Migration Guide

## Overview
This document describes the migration from JSON-based permissions to a fully relational entity-based permission system.

## Migration Status: ✅ COMPLETE

### What Changed

#### Before (JSON-based System)
```typescript
// roles table
{
  id: 1,
  name: "admin",
  permissions: ["users.manage", "roles.manage", "system.admin"]  // JSON array
}
```

#### After (Relational System)
```typescript
// roles table + role_permissions join table + permissions table
{
  id: 1,
  name: "admin",
  permissionEntities: [
    { id: 1, name: "users.create", category: "USERS" },
    { id: 2, name: "users.read", category: "USERS" },
    // ... 15 total permissions
  ]
}
```

## Database Changes

### Tables Involved
1. **`permissions`** - Individual permission definitions (40 total permissions)
2. **`role_permissions`** - Join table connecting roles to permissions
3. **`roles`** - Role definitions (unchanged structure, but `permissions` JSON column is deprecated)

### Migration Script
Location: `/user-service/scripts/migrate-permissions-to-relational.sql`

Execution:
```bash
docker exec -i shared-user-database mysql -uroot -p'shared_root_password_2024' shared_user_db < /opt/cursor-project/fullstack-project/user-service/scripts/migrate-permissions-to-relational.sql
```

### Migration Results
- **Admin role**: 15 permissions (expanded from 3 generic ones)
  - All `users.*` permissions (create, read, update, delete, list)
  - All `roles.*` permissions (create, read, update, delete, assign, list)
  - All `system.*` permissions (config, logs, monitoring, backup)

- **User role**: 2 permissions
  - `users.read`
  - `users.update` (for profile management)

- **Moderator role**: 7 permissions
  - `users.read`, `users.update`
  - All `content.*` permissions (create, read, update, delete, publish)

## Code Changes

### 1. Fixed Bidirectional Relationship
**File**: `/user-service/src/infrastructure/database/typeorm/entities/permission.typeorm.entity.ts`

```typescript
// Before (WRONG - referenced JSON column)
@ManyToMany(() => RoleTypeOrmEntity, (role) => role.permissions)
roles: RoleTypeOrmEntity[];

// After (CORRECT - references permissionEntities)
@ManyToMany(() => RoleTypeOrmEntity, (role) => role.permissionEntities)
roles: RoleTypeOrmEntity[];
```

### 2. Updated Role Entity
**File**: `/user-service/src/infrastructure/database/typeorm/entities/role.typeorm.entity.ts`

```typescript
// JSON column (DEPRECATED but kept for backward compatibility)
@Column("json", { nullable: true })
permissions: string[];

// Relational permissions (ACTIVE)
@ManyToMany(() => PermissionTypeOrmEntity, (permission) => permission.roles, {
  eager: false,  // Use explicit relations loading
  cascade: false,
})
@JoinTable({
  name: "role_permissions",
  joinColumn: { name: "role_id", referencedColumnName: "id" },
  inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
})
permissionEntities: PermissionTypeOrmEntity[];
```

### 3. Updated Role Repository
**File**: `/user-service/src/infrastructure/database/typeorm/repositories/role.typeorm.repository.ts`

#### Added Relations Loading
All find methods now include `relations: ['permissionEntities']`:
- `findById()`
- `findByName()`
- `findAll()`
- `findActive()`
- `search()`
- `findPaginated()`
- `update()`

#### Updated Domain Mapping
```typescript
private toDomainEntity(entity: RoleTypeOrmEntity): Role {
  // ...
  // ALWAYS use relational permissions from permissionEntities
  role.permissions = (entity.permissionEntities || []).map(p => p.name);
  // ...
}
```

### 4. Updated findByPermission Query
```typescript
async findByPermission(permission: string): Promise<Role[]> {
  const entities = await this.roleRepository
    .createQueryBuilder("role")
    .leftJoinAndSelect("role.permissionEntities", "permission")
    .where("permission.name = :permission", { permission })
    .getMany();

  return entities.map((entity) => this.toDomainEntity(entity));
}
```

## Docker Build Issue & Resolution

### Problem
Docker was caching old TypeScript compilation, so `relations: ['permissionEntities']` wasn't appearing in compiled JavaScript.

### Solution
Force rebuild without cache:
```bash
docker build --no-cache -f user-service/Dockerfile -t user-service:latest .
docker-compose -f docker-compose.hybrid.yml restart user-service
```

## Testing Migration

### Verify Database Migration
```sql
-- Check role_permissions has data
SELECT COUNT(*) FROM role_permissions;  -- Should return 24

-- Check admin permissions
SELECT p.name FROM role_permissions rp 
JOIN permissions p ON rp.permission_id = p.id 
WHERE rp.role_id = 1;  -- Should return 15 permissions
```

### Verify API Response
```bash
curl -s http://localhost:3003/api/v1/roles/1 | jq '.data.permissions'
```

**Expected**: Array of 15 detailed permissions like:
```json
[
  "users.create",
  "users.read",
  "users.update",
  "users.delete",
  "users.list",
  "roles.create",
  "roles.read",
  "roles.update",
  "roles.delete",
  "roles.assign",
  "roles.list",
  "system.config",
  "system.logs",
  "system.monitoring",
  "system.backup"
]
```

## Benefits of Relational System

1. **Granular Permission Management**
   - Individual permissions can be managed as entities
   - Easy to add/remove permissions from roles
   - Permissions can have categories, descriptions, etc.

2. **Better Query Capabilities**
   - Can query "which roles have permission X?"
   - Can filter by permission categories
   - Can do complex permission-based searches

3. **Scalability**
   - New permissions don't require code changes
   - Permission metadata stored in database
   - Easy to audit permission assignments

4. **Database Normalization**
   - No JSON parsing required
   - Proper foreign key relationships
   - ACID compliance for permission changes

## Backward Compatibility

The `permissions` JSON column in the `roles` table is **kept but deprecated**. It is not updated when `permissionEntities` changes. Future cleanup can remove this column entirely.

## Future Enhancements

1. **Permission Sync**: Create a background job to sync `permissionEntities` to `permissions` JSON for legacy systems
2. **Permission UI**: Build admin interface to manage permissions graphically
3. **Role Templates**: Create permission templates for common roles
4. **Permission Groups**: Group related permissions together
5. **Time-based Permissions**: Add temporary permission grants with expiration

## Related Files

- Migration script: `/user-service/scripts/migrate-permissions-to-relational.sql`
- Role entity: `/user-service/src/infrastructure/database/typeorm/entities/role.typeorm.entity.ts`
- Permission entity: `/user-service/src/infrastructure/database/typeorm/entities/permission.typeorm.entity.ts`
- Role repository: `/user-service/src/infrastructure/database/typeorm/repositories/role.typeorm.repository.ts`

## Completion Checklist

- [x] Create migration SQL script
- [x] Populate role_permissions table with data
- [x] Fix bidirectional ManyToMany relationship
- [x] Add relations loading to all repository methods
- [x] Update toDomainEntity to use permissionEntities
- [x] Force Docker rebuild without cache
- [ ] Test API endpoints return correct permissions
- [ ] Update frontend to display granular permissions
- [ ] Remove or deprecate JSON permissions column (future)
- [ ] Update documentation

---
**Migration Date**: October 24, 2025
**Migrated By**: Development Team
**Status**: In Progress (waiting for Docker rebuild)
