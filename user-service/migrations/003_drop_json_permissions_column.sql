-- Migration: Drop JSON permissions column from roles table
-- Date: October 24, 2025
-- Description: Remove deprecated JSON permissions column, using only relational permissions via role_permissions table
-- ============================================
-- BACKUP RECOMMENDATION
-- ============================================
-- Before running this migration, ensure you have a database backup!
-- This migration is IRREVERSIBLE once the column is dropped.
-- ============================================
-- VERIFICATION: Check current state
-- ============================================
-- Verify JSON column exists
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  COLUMN_TYPE
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA = 'shared_user_db'
  AND TABLE_NAME = 'roles'
  AND COLUMN_NAME = 'permissions';

-- Verify relational data exists (should have records)
SELECT
  COUNT(*) as relational_permission_count
FROM
  role_permissions;

-- ============================================
-- MIGRATION: Drop JSON permissions column
-- ============================================
-- WARNING: This is a breaking change for any services still reading the JSON column
-- Ensure all services use the relational permission system before running this!
ALTER TABLE
  roles DROP COLUMN permissions;

-- ============================================
-- POST-MIGRATION VERIFICATION
-- ============================================
-- Verify column is gone
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  COLUMN_TYPE
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA = 'shared_user_db'
  AND TABLE_NAME = 'roles'
  AND COLUMN_NAME = 'permissions';

-- Should return 0 rows
-- Verify roles still have permissions via relational system
SELECT
  r.id,
  r.name,
  COUNT(rp.permission_id) as permission_count
FROM
  roles r
  LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY
  r.id,
  r.name
ORDER BY
  r.id;

-- Should show:
-- admin: 15 permissions
-- user: 2 permissions
-- moderator: 7 permissions
-- ============================================
-- ROLLBACK (if needed - WILL LOSE DATA)
-- ============================================
-- If you need to rollback, you'll need to restore from backup
-- Or manually add the column back (but data will be lost):
-- ALTER TABLE roles ADD COLUMN permissions JSON NULL;