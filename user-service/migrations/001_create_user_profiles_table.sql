-- Migration: Create user_profiles table
-- Description: Adds user profile functionality with extended user information
-- Date: 2025-10-22

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `date_of_birth` DATE NULL,
  `bio` TEXT NULL,
  `avatar` VARCHAR(500) NULL,
  `address` JSON NULL,
  `social_links` JSON NULL,
  `preferences` JSON NULL,
  `metadata` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT `fk_user_profile_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to table
ALTER TABLE `user_profiles` COMMENT = 'Stores extended user profile information';
