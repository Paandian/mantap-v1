-- Compatible database migration for mantap.work user management
-- Works with older MySQL versions (removes IF NOT EXISTS from ALTER TABLE)

USE mantap_work_db;

-- ============================================
-- 1. UPDATE EXISTING USERS TABLE
-- ============================================

-- Check and add status column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'status');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN status ENUM("active", "inactive", "suspended", "pending") DEFAULT "pending"', 'SELECT "status column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add avatar_url column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'avatar_url');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL', 'SELECT "avatar_url column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add phone column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'phone');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL', 'SELECT "phone column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add last_login column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'last_login');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL', 'SELECT "last_login column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add email_verified column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'email_verified');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE', 'SELECT "email_verified column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add phone_verified column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'phone_verified');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE', 'SELECT "phone_verified column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add created_by column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'created_by');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN created_by INT DEFAULT NULL', 'SELECT "created_by column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add notes column
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'notes');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD COLUMN notes TEXT DEFAULT NULL', 'SELECT "notes column already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key for created_by (only if it doesn't exist)
SET @exist := (SELECT COUNT(*) FROM information_schema.table_constraints 
               WHERE table_name = 'users' AND constraint_name = 'fk_users_created_by');
SET @sql := IF(@exist = 0, 'ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL', 'SELECT "foreign key already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update role column to support new hierarchy
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

-- ============================================
-- 2. CREATE PERMISSIONS SYSTEM
-- ============================================

-- Table for permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for role-permission mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM(
        'super-admin', 'admin', 'creator', 'mentor', 'tutor', 
        'parent', 'student', 'publisher', 'merchant', 'tuition-center', 'user'
    ) NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role, permission_id)
);

-- ============================================
-- 3. CREATE USER PROFILES TABLES
-- ============================================

-- Table for user profiles (extended information)
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
    preferences JSON DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for user activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) DEFAULT NULL,
    entity_id INT DEFAULT NULL,
    old_values JSON DEFAULT NULL,
    new_values JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 4. INSERT DEFAULT PERMISSIONS
-- ============================================

INSERT IGNORE INTO permissions (name, description, module, action) VALUES
('users.view', 'View users list and details', 'users', 'read'),
('users.create', 'Create new users', 'users', 'create'),
('users.update', 'Update user information', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete'),
('users.manage', 'Full user management', 'users', 'manage'),
('content.view', 'View content', 'content', 'read'),
('content.create', 'Create content', 'content', 'create'),
('content.update', 'Update content', 'content', 'update'),
('content.delete', 'Delete content', 'content', 'delete'),
('dashboard.view', 'View dashboard', 'dashboard', 'read');

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
SELECT 'Migration completed successfully!' as message;
