-- Database schema update for mantap.work user management system
-- This migration adds comprehensive role hierarchy and permissions system
-- Run this after the initial schema is set up

USE mantap_work_db;

-- ============================================
-- 1. UPDATE EXISTING USERS TABLE
-- ============================================

-- Modify users table to support new role hierarchy
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

-- Add new columns to users table for enhanced user management
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL,
ADD FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 2. CREATE PERMISSIONS SYSTEM
-- ============================================

-- Table for permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, manage
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

-- Table for parent-student relationships
CREATE TABLE IF NOT EXISTS parent_student_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    student_id INT NOT NULL,
    relationship_type ENUM('father', 'mother', 'guardian', 'other') DEFAULT 'guardian',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_parent_student (parent_id, student_id)
);

-- Table for user activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) DEFAULT NULL, -- user, content, etc.
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

INSERT INTO permissions (name, description, module, action) VALUES
-- User Management
('users.view', 'View users list and details', 'users', 'read'),
('users.create', 'Create new users', 'users', 'create'),
('users.update', 'Update user information', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete'),
('users.manage', 'Full user management (activate, suspend, assign roles)', 'users', 'manage'),
('users.assign_role', 'Assign roles to users', 'users', 'manage'),

-- Content Management
('content.view', 'View content', 'content', 'read'),
('content.create', 'Create content', 'content', 'create'),
('content.update', 'Update content', 'content', 'update'),
('content.delete', 'Delete content', 'content', 'delete'),
('content.publish', 'Publish/unpublish content', 'content', 'manage'),
('content.moderate', 'Moderate user-generated content', 'content', 'manage'),

-- Tutor/Mentor Management
('tutors.view', 'View tutor profiles', 'tutors', 'read'),
('tutors.create', 'Create tutor profiles', 'tutors', 'create'),
('tutors.update', 'Update tutor profiles', 'tutors', 'update'),
('tutors.delete', 'Delete tutor profiles', 'tutors', 'delete'),
('tutors.verify', 'Verify tutor credentials', 'tutors', 'manage'),

('mentors.view', 'View mentor profiles', 'mentors', 'read'),
('mentors.create', 'Create mentor profiles', 'mentors', 'create'),
('mentors.update', 'Update mentor profiles', 'mentors', 'update'),
('mentors.delete', 'Delete mentor profiles', 'mentors', 'delete'),
('mentors.verify', 'Verify mentor credentials', 'mentors', 'manage'),

-- School Management
('schools.view', 'View schools directory', 'schools', 'read'),
('schools.create', 'Add schools', 'schools', 'create'),
('schools.update', 'Update school information', 'schools', 'update'),
('schools.delete', 'Delete schools', 'schools', 'delete'),
('schools.claim', 'Manage school claims', 'schools', 'manage'),

-- Merchant Management
('merchants.view', 'View merchant profiles', 'merchants', 'read'),
('merchants.create', 'Create merchant profiles', 'merchants', 'create'),
('merchants.update', 'Update merchant profiles', 'merchants', 'update'),
('merchants.delete', 'Delete merchant profiles', 'merchants', 'delete'),
('merchants.verify', 'Verify merchant status', 'merchants', 'manage'),

-- Publisher Management
('publishers.view', 'View publishers', 'publishers', 'read'),
('publishers.create', 'Add publishers', 'publishers', 'create'),
('publishers.update', 'Update publisher information', 'publishers', 'update'),
('publishers.delete', 'Delete publishers', 'publishers', 'delete'),
('publishers.verify', 'Verify publisher status', 'publishers', 'manage'),

-- Book Management
('books.view', 'View books', 'books', 'read'),
('books.create', 'Add books', 'books', 'create'),
('books.update', 'Update book information', 'books', 'update'),
('books.delete', 'Delete books', 'books', 'delete'),

-- Tuition Center Management
('tuition_centers.view', 'View tuition centers', 'tuition_centers', 'read'),
('tuition_centers.create', 'Add tuition centers', 'tuition_centers', 'create'),
('tuition_centers.update', 'Update tuition center information', 'tuition_centers', 'update'),
('tuition_centers.delete', 'Delete tuition centers', 'tuition_centers', 'delete'),
('tuition_centers.verify', 'Verify tuition centers', 'tuition_centers', 'manage'),

-- System Settings
('settings.view', 'View system settings', 'settings', 'read'),
('settings.update', 'Update system settings', 'settings', 'update'),
('settings.backup', 'Manage backups', 'settings', 'manage'),
('settings.logs', 'View system logs', 'settings', 'read'),

-- Dashboard & Analytics
('dashboard.view', 'View dashboard', 'dashboard', 'read'),
('analytics.view', 'View analytics and reports', 'analytics', 'read'),

-- Parent/Student Features
('children.view', 'View linked children/students', 'children', 'read'),
('children.manage', 'Manage children/student connections', 'children', 'manage'),
('progress.view', 'View learning progress', 'progress', 'read'),
('progress.track', 'Track learning progress', 'progress', 'create');

-- ============================================
-- 5. ASSIGN PERMISSIONS TO ROLES
-- ============================================

-- Super Admin: All permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'super-admin', id FROM permissions;

-- Admin: Most permissions except super-admin specific
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions 
WHERE name NOT IN ('settings.backup', 'settings.logs');

-- Creator: Content management permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'creator', id FROM permissions 
WHERE module IN ('content', 'tutors', 'mentors', 'schools', 'merchants', 'publishers', 'books', 'tuition_centers', 'dashboard', 'analytics')
AND action IN ('view', 'create', 'update', 'delete', 'publish');

-- Mentor: Limited permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'mentor', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'mentors.view', 'schools.view', 'dashboard.view', 'progress.view', 'progress.track');

-- Tutor: Similar to mentor
INSERT INTO role_permissions (role, permission_id)
SELECT 'tutor', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'mentors.view', 'schools.view', 'dashboard.view', 'progress.view', 'progress.track');

-- Parent: View permissions and manage children
INSERT INTO role_permissions (role, permission_id)
SELECT 'parent', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'mentors.view', 'schools.view', 'merchants.view', 'publishers.view', 'books.view', 'tuition_centers.view', 'children.view', 'children.manage', 'progress.view', 'dashboard.view');

-- Student: Basic view permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'student', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'mentors.view', 'schools.view', 'merchants.view', 'publishers.view', 'books.view', 'tuition_centers.view', 'progress.view', 'dashboard.view');

-- Publisher: Manage own content and books
INSERT INTO role_permissions (role, permission_id)
SELECT 'publisher', id FROM permissions 
WHERE name IN ('content.view', 'books.view', 'books.create', 'books.update', 'publishers.view', 'dashboard.view');

-- Merchant: Manage own profile and products
INSERT INTO role_permissions (role, permission_id)
SELECT 'merchant', id FROM permissions 
WHERE name IN ('content.view', 'merchants.view', 'merchants.update', 'dashboard.view');

-- Tuition Center: Manage own center and tutors
INSERT INTO role_permissions (role, permission_id)
SELECT 'tuition-center', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'tutors.create', 'tutors.update', 'tuition_centers.view', 'tuition_centers.update', 'dashboard.view');

-- User: Basic view only
INSERT INTO role_permissions (role, permission_id)
SELECT 'user', id FROM permissions 
WHERE name IN ('content.view', 'tutors.view', 'mentors.view', 'schools.view', 'merchants.view', 'publishers.view', 'books.view', 'tuition_centers.view');

-- ============================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_user_activity_logs_action ON user_activity_logs(action);

-- ============================================
-- 7. CREATE DEFAULT SUPER ADMIN
-- ============================================

-- Note: Change the password after first login!
-- Default password: SuperAdmin@2024
INSERT INTO users (email, password, name, role, status, email_verified) 
VALUES (
    'superadmin@mantap.work',
    '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
    'Super Administrator',
    'super-admin',
    'active',
    TRUE
) ON DUPLICATE KEY UPDATE role = 'super-admin', status = 'active';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
