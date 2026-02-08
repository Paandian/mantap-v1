-- Simple compatible database migration for mantap.work
-- Works with older MySQL versions

USE mantap_work_db;

-- ============================================
-- 1. ADD COLUMNS TO USERS TABLE (one at a time)
-- ============================================

-- Add status column
ALTER TABLE users ADD COLUMN status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending';

-- Add avatar_url column  
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL;

-- Add phone column
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;

-- Add last_login column
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL;

-- Add email_verified column
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Add phone_verified column
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

-- Add created_by column
ALTER TABLE users ADD COLUMN created_by INT DEFAULT NULL;

-- Add notes column
ALTER TABLE users ADD COLUMN notes TEXT DEFAULT NULL;

-- Update role column to support new hierarchy
ALTER TABLE users MODIFY COLUMN role ENUM(
    'super-admin', 'admin', 'creator', 'mentor', 'tutor',
    'parent', 'student', 'publisher', 'merchant', 'tuition-center', 'user'
) DEFAULT 'user';

-- ============================================
-- 2. CREATE PERMISSIONS SYSTEM
-- ============================================

-- Table for permissions
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for role-permission mapping
CREATE TABLE role_permissions (
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
-- 3. CREATE USER PROFILES TABLE
-- ============================================

CREATE TABLE user_profiles (
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
    social_links TEXT DEFAULT NULL,
    preferences TEXT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- 4. CREATE ACTIVITY LOGS TABLE
-- ============================================

CREATE TABLE user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) DEFAULT NULL,
    entity_id INT DEFAULT NULL,
    old_values TEXT DEFAULT NULL,
    new_values TEXT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 5. INSERT DEFAULT PERMISSIONS
-- ============================================

INSERT INTO permissions (name, description, module, action) VALUES
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
-- 6. CREATE INDEXES
-- ============================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_user_activity_logs_action ON user_activity_logs(action);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
