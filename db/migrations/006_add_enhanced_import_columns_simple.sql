-- ============================================
-- Migration: Add Enhanced Import Columns (Simple Version)
-- Date: 2026-02-11
-- Description: Add strategy and normalization_log columns to school_import_logs
-- Compatible with MySQL 5.7+ and MySQL 8.0+
-- ============================================

-- Simple version without IF NOT EXISTS (for older MySQL compatibility)
-- Run these commands one by one in phpMyAdmin if needed

-- Add strategy column
ALTER TABLE school_import_logs 
ADD COLUMN strategy VARCHAR(50) DEFAULT 'merge' COMMENT 'Import strategy: merge, drop_and_import, backup_and_drop';

-- Add normalization_log column  
ALTER TABLE school_import_logs 
ADD COLUMN normalization_log TEXT NULL COMMENT 'JSON object storing negeri and bandar normalization mappings';

-- If you get "Duplicate column name" error, the columns already exist (which is fine)
-- If you get "Table doesn't exist" error, check your database name

-- Verify the columns exist:
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = DATABASE() 
-- AND TABLE_NAME = 'school_import_logs' 
-- AND COLUMN_NAME IN ('strategy', 'normalization_log');