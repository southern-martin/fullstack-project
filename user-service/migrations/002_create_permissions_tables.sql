-- Migration: Create permissions and role_permissions tables
-- Description: Creates normalized permission structure for RBAC
-- Author: AI Assistant
-- Date: 2025-10-24

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert seed permissions for USERS category
INSERT INTO permissions (name, description, category) VALUES
('users.create', 'Create new users', 'USERS'),
('users.read', 'View user information', 'USERS'),
('users.update', 'Update user information', 'USERS'),
('users.delete', 'Delete users', 'USERS'),
('users.list', 'List all users', 'USERS');

-- Insert seed permissions for ROLES category
INSERT INTO permissions (name, description, category) VALUES
('roles.create', 'Create new roles', 'ROLES'),
('roles.read', 'View role information', 'ROLES'),
('roles.update', 'Update role information', 'ROLES'),
('roles.delete', 'Delete roles', 'ROLES'),
('roles.assign', 'Assign roles to users', 'ROLES'),
('roles.list', 'List all roles', 'ROLES');

-- Insert seed permissions for SYSTEM category
INSERT INTO permissions (name, description, category) VALUES
('system.config', 'Modify system configuration', 'SYSTEM'),
('system.logs', 'Access system logs', 'SYSTEM'),
('system.monitoring', 'Access monitoring dashboard', 'SYSTEM'),
('system.backup', 'Perform system backups', 'SYSTEM');

-- Insert seed permissions for CONTENT category
INSERT INTO permissions (name, description, category) VALUES
('content.create', 'Create new content', 'CONTENT'),
('content.read', 'View content', 'CONTENT'),
('content.update', 'Update content', 'CONTENT'),
('content.delete', 'Delete content', 'CONTENT'),
('content.publish', 'Publish content', 'CONTENT');

-- Insert seed permissions for ANALYTICS category
INSERT INTO permissions (name, description, category) VALUES
('analytics.view', 'View analytics dashboard', 'ANALYTICS'),
('analytics.export', 'Export analytics data', 'ANALYTICS'),
('analytics.reports', 'Generate analytics reports', 'ANALYTICS');

-- Insert seed permissions for SETTINGS category
INSERT INTO permissions (name, description, category) VALUES
('settings.view', 'View system settings', 'SETTINGS'),
('settings.update', 'Update system settings', 'SETTINGS'),
('settings.advanced', 'Access advanced settings', 'SETTINGS');

-- Insert seed permissions for CARRIERS category
INSERT INTO permissions (name, description, category) VALUES
('carriers.create', 'Create new carriers', 'CARRIERS'),
('carriers.read', 'View carrier information', 'CARRIERS'),
('carriers.update', 'Update carrier information', 'CARRIERS'),
('carriers.delete', 'Delete carriers', 'CARRIERS'),
('carriers.list', 'List all carriers', 'CARRIERS');

-- Insert seed permissions for CUSTOMERS category
INSERT INTO permissions (name, description, category) VALUES
('customers.create', 'Create new customers', 'CUSTOMERS'),
('customers.read', 'View customer information', 'CUSTOMERS'),
('customers.update', 'Update customer information', 'CUSTOMERS'),
('customers.delete', 'Delete customers', 'CUSTOMERS'),
('customers.list', 'List all customers', 'CUSTOMERS');

-- Insert seed permissions for PRICING category
INSERT INTO permissions (name, description, category) VALUES
('pricing.view', 'View pricing information', 'PRICING'),
('pricing.update', 'Update pricing rules', 'PRICING'),
('pricing.calculate', 'Calculate pricing', 'PRICING'),
('pricing.approve', 'Approve pricing changes', 'PRICING');
