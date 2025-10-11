-- Initialize shared database for Auth and User services
-- This script creates the necessary tables for both services

-- Create users table (shared between Auth and User services)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Create roles table (shared between Auth and User services)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Create user_roles junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
);

-- Insert default roles
INSERT IGNORE INTO roles (name, description, permissions, is_active) VALUES
('admin', 'Administrator with full access', '["*"]', TRUE),
('user', 'Regular user with basic access', '["read:own", "update:own"]', TRUE),
('editor', 'Editor with content management access', '["read:all", "create:content", "update:content"]', TRUE),
('viewer', 'Viewer with read-only access', '["read:all"]', TRUE);

-- Create a default admin user (password: admin123)
INSERT IGNORE INTO users (email, password, first_name, last_name, is_active, is_email_verified) VALUES
('admin@example.com', '$2b$10$rQZ8K9vXvQZ8K9vXvQZ8K.9vXvQZ8K9vXvQZ8K9vXvQZ8K9vXvQZ8K9vX', 'Admin', 'User', TRUE, TRUE);

-- Assign admin role to the default admin user
INSERT IGNORE INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@example.com' AND r.name = 'admin';



