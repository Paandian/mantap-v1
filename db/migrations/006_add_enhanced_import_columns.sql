-- ============================================
-- Migration: Add Enhanced Import Columns
-- Date: 2026-02-11
-- Description: Add strategy and normalization_log columns to school_import_logs
-- ============================================

-- Use the correct database
USE mantap_work_db;

-- Add strategy column to track import strategy used
-- Check if column exists first (MySQL compatible)
SET @dbname = DATABASE();
SET @tablename = 'school_import_logs';
SET @columnname = 'strategy';

SET @sql = CONCAT(
  'ALTER TABLE ', @tablename, 
  ' ADD COLUMN ', @columnname, ' VARCHAR(50) DEFAULT ''merge'' COMMENT ''Import strategy: merge, drop_and_import, backup_and_drop'''
);

SET @check_sql = CONCAT(
  'SELECT COUNT(*) INTO @exists FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = ''', @dbname, ''' 
   AND TABLE_NAME = ''', @tablename, ''' 
   AND COLUMN_NAME = ''', @columnname, ''''
);

PREPARE check_stmt FROM @check_sql;
EXECUTE check_stmt;
DEALLOCATE PREPARE check_stmt;

SET @do_sql = IF(@exists = 0, @sql, 'SELECT ''Column strategy already exists'' as message');
PREPARE stmt FROM @do_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add normalization_log column to store normalization audit trail
SET @columnname2 = 'normalization_log';

SET @sql2 = CONCAT(
  'ALTER TABLE ', @tablename, 
  ' ADD COLUMN ', @columnname2, ' JSON NULL COMMENT ''JSON object storing negeri and bandar normalization mappings'''
);

SET @check_sql2 = CONCAT(
  'SELECT COUNT(*) INTO @exists2 FROM information_schema.COLUMNS 
   WHERE TABLE_SCHEMA = ''', @dbname, ''' 
   AND TABLE_NAME = ''', @tablename, ''' 
   AND COLUMN_NAME = ''', @columnname2, ''''
);

PREPARE check_stmt2 FROM @check_sql2;
EXECUTE check_stmt2;
DEALLOCATE PREPARE check_stmt2;

SET @do_sql2 = IF(@exists2 = 0, @sql2, 'SELECT ''Column normalization_log already exists'' as message');
PREPARE stmt2 FROM @do_sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Verify columns were added
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'school_import_logs' 
AND COLUMN_NAME IN ('strategy', 'normalization_log');