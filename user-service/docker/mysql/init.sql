-- User Service Database Initialization
CREATE DATABASE IF NOT EXISTS user_service_db;
USE user_service_db;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'user_service_user'@'%' IDENTIFIED BY 'user_service_password';
GRANT ALL PRIVILEGES ON user_service_db.* TO 'user_service_user'@'%';
FLUSH PRIVILEGES;







