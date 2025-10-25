# Kong Integration - Phase 2: Route-Level Access Control

## Current State Analysis

### ✅ What We Have
- **Kong Integration**: All 411 users migrated with Kong consumers
- **Basic Role System**: 
  - `admin` role (users.manage, roles.manage, system.admin)
  - `user` role (users.read, profile.manage)
  - `moderator` role (users.read, users.update, content.moderate)
- **ACL Groups in Kong**: Consumers assigned to groups based on roles
- **User Entity**: Has `roles[]` array and `hasRole()`, `hasPermission()` methods

### ⚠️ Current Limitations
- **No full RBAC/Permission system** in User Service
- **No dedicated Permission entity** or permission management
- **Simple role-to-ACL mapping**: Currently just using role names as ACL groups

## Phase 2 Goals

### Primary Objectives
1. **Configure Kong ACL Plugin** on routes to enforce role-based access
2. **Implement Route Protection** for different service endpoints
3. **Create flexible permission mapping** that works with current basic roles
4. **Document clear upgrade path** to full RBAC when ready

### Out of Scope (Future Phases)
- Full Permission entity and management UI
- Dynamic permission assignment
- Complex permission hierarchies
- Permission caching strategies

## Implementation Strategy

### A. Kong ACL Plugin Configuration (Service Level)

We'll configure Kong ACL plugin at the **service level** for each microservice:

```yaml
# Example: Auth Service Protection
Service: auth-service
  Routes:
    - /api/v1/auth/register  → No ACL (public)
    - /api/v1/auth/login     → No ACL (public)
    - /api/v1/auth/logout    → ACL: [user, admin, moderator]
    - /api/v1/auth/profile   → ACL: [user, admin, moderator]
    
# Example: User Service Protection  
Service: user-service
  Routes:
    - GET  /api/v1/users     → ACL: [admin, moderator]
    - GET  /api/v1/users/:id → ACL: [user, admin, moderator]
    - POST /api/v1/users     → ACL: [admin]
    - PUT  /api/v1/users/:id → ACL: [admin, moderator]
    - DEL  /api/v1/users/:id → ACL: [admin]
```

### B. Enhanced Kong Service

Extend `KongService` with:
1. **Route ACL Configuration**: Methods to configure ACL per route
2. **Bulk ACL Setup**: Configure all routes at once
3. **ACL Group Management**: Add/remove groups from consumers

### C. Permission-to-ACL Mapping

Create a flexible mapping system:

```typescript
// permission-to-acl.mapping.ts
export const PERMISSION_TO_ACL_GROUPS = {
  // Admin permissions → admin ACL group
  'users.manage': ['admin'],
  'roles.manage': ['admin'],
  'system.admin': ['admin'],
  
  // Moderator permissions → moderator ACL group
  'users.update': ['moderator', 'admin'],
  'content.moderate': ['moderator', 'admin'],
  
  // User permissions → user ACL group
  'users.read': ['user', 'moderator', 'admin'],
  'profile.manage': ['user', 'moderator', 'admin'],
};

// Role-based ACL assignment
export const ROLE_TO_ACL_GROUPS = {
  'admin': ['admin', 'user'],        // Admins get both groups
  'moderator': ['moderator', 'user'], // Moderators get both
  'user': ['user'],                   // Users get basic access
};
```

### D. Route Protection Levels

Define 3 protection levels:

1. **Public Routes**: No authentication required
   - `/api/v1/auth/register`
   - `/api/v1/auth/login`
   - `/api/v1/health`

2. **Authenticated Routes**: Any logged-in user
   - `/api/v1/auth/profile`
   - `/api/v1/auth/logout`
   - `/api/v1/users/:id` (own profile)

3. **Role-Protected Routes**: Specific roles required
   - `/api/v1/users` (admin, moderator)
   - `/api/v1/roles` (admin only)
   - `/api/v1/system/*` (admin only)

## Implementation Tasks

### Task 1: Enhance KongService (2 hours)
- [ ] Add `configureRouteACL(routeId, allowedGroups)` method
- [ ] Add `configureServiceACL(serviceId, aclConfig)` method
- [ ] Add `addConsumerToGroups(consumerId, groups)` method
- [ ] Add `removeConsumerFromGroups(consumerId, groups)` method
- [ ] Add `getConsumerGroups(consumerId)` method

### Task 2: Create ACL Configuration Files (1 hour)
- [ ] Create `kong-routes.config.ts` with all route definitions
- [ ] Create `permission-acl.mapping.ts` with permission mappings
- [ ] Create `role-acl.mapping.ts` with role-to-ACL mappings

### Task 3: Update User Sync Logic (1 hour)
- [ ] Modify `updateKongConsumerGroups()` to use role-based mapping
- [ ] Ensure hierarchical group assignment (admin gets user group too)
- [ ] Update migration script to assign proper groups

### Task 4: Kong Route Configuration Script (2 hours)
- [ ] Create `scripts/configure-kong-routes.ts` 
- [ ] Implement bulk route ACL configuration
- [ ] Add verification logic
- [ ] Create rollback mechanism

### Task 5: Testing & Verification (2 hours)
- [ ] Test public routes (no auth required)
- [ ] Test authenticated routes (any user)
- [ ] Test admin-only routes
- [ ] Test moderator routes
- [ ] Test cross-role access
- [ ] Verify ACL denial responses

### Task 6: Documentation (1 hour)
- [ ] Update KONG-INTEGRATION-GUIDE.md
- [ ] Create route protection reference
- [ ] Document testing procedures
- [ ] Create troubleshooting guide

## Technical Implementation Details

### Kong ACL Plugin Configuration

```bash
# Configure ACL plugin on a route
curl -X POST http://localhost:8001/routes/{route-id}/plugins \
  --data "name=acl" \
  --data "config.allow[]=admin" \
  --data "config.allow[]=moderator" \
  --data "config.hide_groups_header=true"
```

### Enhanced Kong Consumer Groups

```typescript
// Current: Simple role name as group
await kong.post(`/consumers/${consumerId}/acls`, {
  group: 'user'
});

// Phase 2: Multiple groups based on role hierarchy
const groups = ROLE_TO_ACL_GROUPS[roleName] || ['user'];
for (const group of groups) {
  await kong.post(`/consumers/${consumerId}/acls`, {
    group
  });
}
```

### Route ACL Configuration Example

```typescript
const AUTH_ROUTES_CONFIG = {
  publicRoutes: [
    { path: '/api/v1/auth/register', methods: ['POST'] },
    { path: '/api/v1/auth/login', methods: ['POST'] },
  ],
  authenticatedRoutes: [
    { path: '/api/v1/auth/profile', methods: ['GET', 'PUT'], groups: ['user'] },
    { path: '/api/v1/auth/logout', methods: ['POST'], groups: ['user'] },
  ],
  adminRoutes: [
    { path: '/api/v1/auth/users', methods: ['GET', 'POST', 'PUT', 'DELETE'], groups: ['admin'] },
  ],
};
```

## Migration Path for Existing Users

Since all 411 users are already in Kong, we need to:

1. **Re-run migration with enhanced ACL logic**:
   ```typescript
   // Old: Single group assignment
   groups: [roleName]
   
   // New: Hierarchical group assignment
   groups: ROLE_TO_ACL_GROUPS[roleName]
   ```

2. **Update existing consumers**:
   - Fetch all Kong consumers
   - Check their current ACL groups
   - Add missing groups based on user roles
   - Verify assignment

## Success Criteria

### Phase 2 Complete When:
- ✅ All routes have appropriate ACL configuration
- ✅ Public routes accessible without authentication
- ✅ User routes require authentication
- ✅ Admin routes only accessible to admins
- ✅ Moderator routes accessible to moderators and admins
- ✅ All 411+ users have correct ACL group assignments
- ✅ Testing suite passes 100%
- ✅ Documentation complete

## Future Enhancement Path (Phase 3+)

When you're ready to implement full RBAC:

### Phase 3: Permission Management System
1. Create `Permission` entity
2. Implement permission CRUD operations
3. Create admin UI for permission management
4. Implement dynamic role-permission assignment

### Phase 4: Advanced RBAC
1. Resource-level permissions
2. Conditional permissions
3. Permission inheritance
4. Permission caching layer

### Phase 5: Audit & Compliance
1. Permission change auditing
2. Access logs
3. Compliance reporting
4. Role certification workflows

## Timeline Estimate

- **Phase 2 Implementation**: 8-10 hours
- **Testing & Bug Fixes**: 2-3 hours
- **Documentation**: 1-2 hours
- **Total**: ~12-15 hours (1.5-2 days)

## Next Steps

1. ✅ Review this plan
2. 🔄 Approve approach
3. 🚀 Begin Task 1: Enhance KongService
4. 🚀 Continue with Tasks 2-6 sequentially

---

**Note**: This phase works with your current basic role system. When you implement full RBAC with a Permission entity and management system, we'll extend this foundation in Phase 3+.
