-- QUICK FIX: Run this SQL in your MySQL database to add missing columns
-- This fixes the login error by adding required columns to the database

USE servai_mantap_work_db  ;

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active',
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL;

-- Update existing users to have active status
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Update role enum to support new roles
ALTER TABLE users 
MODIFY COLUMN role ENUM(
    'super-admin',
    'admin', 
    'creator',
    'mentor',
    'tutor',
    'parent',
    'student',
    'publisher',
    'merchant',
    'tuition-center',
    'user'
) DEFAULT 'user';

-- Create user_profiles table if not exists
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    bio TEXT DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    country VARCHAR(100) DEFAULT 'Malaysia',
    postal_code VARCHAR(20) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say') DEFAULT NULL,
    education_level VARCHAR(100) DEFAULT NULL,
    occupation VARCHAR(100) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    social_links JSON DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert profiles for existing users that don't have one
INSERT IGNORE INTO user_profiles (user_id) 
SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM user_profiles);

SELECT 'Quick fix applied successfully!' as message;
