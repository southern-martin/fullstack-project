-- Migration Script: Populate role_permissions from roles.permissions JSON
-- This migrates from JSON-based permissions to entity-based relational system

-- Step 1: Clear existing data in role_permissions (if any)
TRUNCATE TABLE role_permissions;

-- Step 2: Map JSON permission strings to permission entity IDs
-- Admin role (id=1) permissions: ["users.manage", "roles.manage", "system.admin"]
-- Map to permission entities by finding closest matches

-- Insert permissions for admin role
-- "users.manage" -> all users.* permissions (1-5)
INSERT INTO role_permissions (role_id, permission_id, created_at)
VALUES 
  (1, 1, NOW()),  -- users.create
  (1, 2, NOW()),  -- users.read
  (1, 3, NOW()),  -- users.update
  (1, 4, NOW()),  -- users.delete
  (1, 5, NOW());  -- users.list

-- "roles.manage" -> all roles.* permissions (6-11)
INSERT INTO role_permissions (role_id, permission_id, created_at)
VALUES 
  (1, 6, NOW()),  -- roles.create
  (1, 7, NOW()),  -- roles.read
  (1, 8, NOW()),  -- roles.update
  (1, 9, NOW()),  -- roles.delete
  (1, 10, NOW()), -- roles.assign
  (1, 11, NOW()); -- roles.list

-- "system.admin" -> all system.* permissions (12-15)
INSERT INTO role_permissions (role_id, permission_id, created_at)
VALUES 
  (1, 12, NOW()), -- system.config
  (1, 13, NOW()), -- system.logs
  (1, 14, NOW()), -- system.monitoring
  (1, 15, NOW()); -- system.backup

-- Insert permissions for user role (id=2)
-- "users.read" -> users.read permission (2)
-- "profile.manage" -> no direct match, map to users.update for self (3)
INSERT INTO role_permissions (role_id, permission_id, created_at)
VALUES 
  (2, 2, NOW()),  -- users.read
  (2, 3, NOW());  -- users.update (for profile management)

-- Insert permissions for moderator role (id=3)
-- "users.read" -> users.read (2)
-- "users.update" -> users.update (3)
-- "content.moderate" -> content.* permissions (16-20)
INSERT INTO role_permissions (role_id, permission_id, created_at)
VALUES 
  (3, 2, NOW()),  -- users.read
  (3, 3, NOW()),  -- users.update
  (3, 16, NOW()), -- content.create
  (3, 17, NOW()), -- content.read
  (3, 18, NOW()), -- content.update
  (3, 19, NOW()), -- content.delete
  (3, 20, NOW()); -- content.publish

-- Step 3: Verify migration
SELECT 'Migration Summary:' as message;
SELECT r.id, r.name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name;

SELECT 'Role Permissions Details:' as message;
SELECT r.name as role, p.name as permission, p.category
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
ORDER BY r.id, p.category, p.name;
