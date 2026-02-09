-- Fix schools table - Add missing columns
-- Run this if the table exists but missing columns

USE mantap_work_db;

-- Check if columns exist and add them
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'kod_sekolah');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN kod_sekolah VARCHAR(20) UNIQUE', 'SELECT "kod_sekolah already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add nama_sekolah
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'nama_sekolah');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN nama_sekolah VARCHAR(255) NOT NULL', 'SELECT "nama_sekolah already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add negeri
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'negeri');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN negeri VARCHAR(100) NOT NULL', 'SELECT "negeri already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add ppd
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'ppd');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN ppd VARCHAR(255)', 'SELECT "ppd already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add peringkat
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'peringkat');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN peringkat ENUM("Rendah", "Menengah") NOT NULL', 'SELECT "peringkat already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add jenis
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'jenis');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN jenis VARCHAR(50) NOT NULL', 'SELECT "jenis already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add alamat_surat
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'alamat_surat');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN alamat_surat TEXT', 'SELECT "alamat_surat already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add poskod
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'poskod');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN poskod VARCHAR(10)', 'SELECT "poskod already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add bandar
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'bandar');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN bandar VARCHAR(100)', 'SELECT "bandar already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add no_telefon
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'no_telefon');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN no_telefon VARCHAR(20)', 'SELECT "no_telefon already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add no_faks
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'no_faks');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN no_faks VARCHAR(20)', 'SELECT "no_faks already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add email
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'email');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN email VARCHAR(255)', 'SELECT "email already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add lokasi
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'lokasi');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN lokasi ENUM("Bandar", "Luar Bandar")', 'SELECT "lokasi already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add koordinat_x
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'koordinat_x');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN koordinat_x DECIMAL(12, 8)', 'SELECT "koordinat_x already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add koordinat_y
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'koordinat_y');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN koordinat_y DECIMAL(12, 8)', 'SELECT "koordinat_y already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add jumlah_murid
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'jumlah_murid');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN jumlah_murid INT DEFAULT 0', 'SELECT "jumlah_murid already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add jumlah_guru
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'jumlah_guru');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN jumlah_guru INT DEFAULT 0', 'SELECT "jumlah_guru already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add prasekolah
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'prasekolah');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN prasekolah VARCHAR(10) DEFAULT "TIADA"', 'SELECT "prasekolah already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add integrasi
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'integrasi');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN integrasi VARCHAR(10) DEFAULT "TIADA"', 'SELECT "integrasi already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add bantuan
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'bantuan');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN bantuan VARCHAR(50)', 'SELECT "bantuan already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add status_claim
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'status_claim');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN status_claim ENUM("UNCLAIMED", "PENDING", "CLAIMED", "REJECTED") DEFAULT "UNCLAIMED"', 'SELECT "status_claim already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add claimed_by
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'claimed_by');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN claimed_by INT DEFAULT NULL', 'SELECT "claimed_by already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add claimed_at
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'claimed_at');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN claimed_at TIMESTAMP NULL DEFAULT NULL', 'SELECT "claimed_at already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_by
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'verified_by');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN verified_by INT DEFAULT NULL', 'SELECT "verified_by already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_at
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'verified_at');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN verified_at TIMESTAMP NULL DEFAULT NULL', 'SELECT "verified_at already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verification_notes
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'verification_notes');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN verification_notes TEXT', 'SELECT "verification_notes already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add import_batch
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'import_batch');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN import_batch VARCHAR(50)', 'SELECT "import_batch already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add imported_at
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns 
                      WHERE table_name = 'schools' AND column_name = 'imported_at');
SET @sql = IF(@column_exists = 0, 'ALTER TABLE schools ADD COLUMN imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 'SELECT "imported_at already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kod_sekolah ON schools(kod_sekolah);
CREATE INDEX IF NOT EXISTS idx_negeri ON schools(negeri);
CREATE INDEX IF NOT EXISTS idx_peringkat ON schools(peringkat);
CREATE INDEX IF NOT EXISTS idx_jenis ON schools(jenis);
CREATE INDEX IF NOT EXISTS idx_status_claim ON schools(status_claim);

SELECT 'Schools table updated successfully!' as message;
