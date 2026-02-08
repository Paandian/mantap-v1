-- Essential columns only - minimal migration for mantap.work
-- Run this if other migrations fail

USE servai_mantap_work_db;

-- Add essential columns one by one
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE users ADD COLUMN created_by INT DEFAULT NULL;

-- Update existing users to active status
UPDATE users SET status = 'active' WHERE status IS NULL;

-- Create indexes
CREATE INDEX idx_users_status ON users(status);
