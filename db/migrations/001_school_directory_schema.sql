-- School Directory Module Database Schema
-- Created: February 2026
-- Source: Senarai Sekolah Rendah dan Menengah Jun 2022

-- ============================================
-- 1. MAIN SCHOOLS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Official Data from Ministry (Immutable)
    kod_sekolah VARCHAR(20) UNIQUE NOT NULL COMMENT 'School code from MOE (e.g., ABA0001)',
    nama_sekolah VARCHAR(255) NOT NULL COMMENT 'School name',
    negeri VARCHAR(100) NOT NULL COMMENT 'State (e.g., PERAK, SELANGOR)',
    ppd VARCHAR(255) COMMENT 'District Education Office (PPD)',
    peringkat ENUM('Rendah', 'Menengah') NOT NULL COMMENT 'Education level',
    jenis VARCHAR(50) NOT NULL COMMENT 'School type (SK, SMK, SJKC, etc.)',
    
    -- Contact Information
    alamat_surat TEXT COMMENT 'Mailing address',
    poskod VARCHAR(10) COMMENT 'Postal code',
    bandar VARCHAR(100) COMMENT 'City/Town',
    no_telefon VARCHAR(20) COMMENT 'Phone number',
    no_faks VARCHAR(20) COMMENT 'Fax number',
    email VARCHAR(255) COMMENT 'Official email',
    
    -- Location
    lokasi ENUM('Bandar', 'Luar Bandar') COMMENT 'Urban/Rural',
    koordinat_x DECIMAL(12, 8) COMMENT 'Longitude',
    koordinat_y DECIMAL(12, 8) COMMENT 'Latitude',
    
    -- Statistics (from Excel)
    jumlah_murid INT DEFAULT 0 COMMENT 'Number of students',
    jumlah_guru INT DEFAULT 0 COMMENT 'Number of teachers',
    prasekolah VARCHAR(10) DEFAULT 'TIADA' COMMENT 'Has preschool (ADA/TIADA)',
    integrasi VARCHAR(10) DEFAULT 'TIADA' COMMENT 'Has integration program',
    bantuan VARCHAR(50) COMMENT 'Government assistance type',
    
    -- Claim & Verification Status
    status_claim ENUM('UNCLAIMED', 'PENDING', 'CLAIMED', 'REJECTED') DEFAULT 'UNCLAIMED',
    claimed_by INT DEFAULT NULL COMMENT 'User ID who claimed',
    claimed_at TIMESTAMP NULL DEFAULT NULL,
    verified_by INT DEFAULT NULL COMMENT 'Admin who verified claim',
    verified_at TIMESTAMP NULL DEFAULT NULL,
    verification_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When imported from Excel',
    import_batch VARCHAR(50) COMMENT 'Batch identifier for bulk imports',
    
    INDEX idx_kod_sekolah (kod_sekolah),
    INDEX idx_negeri (negeri),
    INDEX idx_peringkat (peringkat),
    INDEX idx_jenis (jenis),
    INDEX idx_ppd (ppd),
    INDEX idx_status_claim (status_claim),
    INDEX idx_location (koordinat_x, koordinat_y),
    FULLTEXT INDEX idx_nama_sekolah (nama_sekolah)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. SCHOOL CLAIM REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS school_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Claim Details
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL COMMENT 'Position at school (e.g., Headmaster, Teacher)',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Verification Documents
    document_url VARCHAR(500) COMMENT 'Uploaded verification document',
    document_type VARCHAR(50) COMMENT 'Type of document (Staff ID, Appointment Letter, etc.)',
    
    -- Claim Status
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    admin_notes TEXT COMMENT 'Notes from admin reviewing claim',
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    reviewed_by INT DEFAULT NULL,
    
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_school_user_claim (school_id, user_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. SCHOOL OFFICIALS (Updated by Claimed Schools)
-- ============================================

CREATE TABLE IF NOT EXISTS school_officials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    
    -- Official Details
    nama VARCHAR(255) NOT NULL COMMENT 'Name',
    jawatan VARCHAR(100) NOT NULL COMMENT 'Position (Headmaster, Senior Assistant, etc.)',
    email VARCHAR(255),
    no_telefon VARCHAR(20),
    gambar_url VARCHAR(500) COMMENT 'Photo URL',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_primary_contact BOOLEAN DEFAULT FALSE COMMENT 'Primary contact person',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_school (school_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. SCHOOL ADDITIONAL INFO (Claimed Schools)
-- ============================================

CREATE TABLE IF NOT EXISTS school_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL UNIQUE,
    
    -- Extended Description
    description TEXT COMMENT 'School description/history',
    visi TEXT COMMENT 'Vision statement',
    misi TEXT COMMENT 'Mission statement',
    moto VARCHAR(255) COMMENT 'School motto',
    
    -- Facilities
    facilities JSON COMMENT 'List of facilities',
    achievements JSON COMMENT 'Notable achievements',
    
    -- Media
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    gallery JSON COMMENT 'Array of image URLs',
    
    -- Social Media
    website VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    
    -- School Hours
    school_hours VARCHAR(100) COMMENT 'e.g., 7:30 AM - 2:30 PM',
    session ENUM('Pagi', 'Petang', 'Pagi & Petang') DEFAULT 'Pagi',
    
    -- Updated By
    last_updated_by INT,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (last_updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. SCHOOL IMPORT HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS school_import_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id VARCHAR(50) NOT NULL,
    filename VARCHAR(255),
    total_records INT DEFAULT 0,
    imported_records INT DEFAULT 0,
    updated_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    errors TEXT,
    imported_by INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_batch (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. INSERT SAMPLE DATA (From Excel Structure)
-- ============================================

-- Insert states reference (for dropdown/filtering)
CREATE TABLE IF NOT EXISTS states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    kod VARCHAR(10),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Malaysian states
INSERT INTO states (nama, kod) VALUES
('PERAK', 'PRK'),
('SELANGOR', 'SGR'),
('PAHANG', 'PHG'),
('KELANTAN', 'KEL'),
('JOHOR', 'JHR'),
('KEDAH', 'KDH'),
('MELAKA', 'MLK'),
('NEGERI SEMBILAN', 'NSN'),
('PULAU PINANG', 'PNG'),
('PERLIS', 'PLS'),
('TERENGGANU', 'TRG'),
('WILAYAH PERSEKUTUAN KUALA LUMPUR', 'WPKL'),
('WILAYAH PERSEKUTUAN LABUAN', 'WPL'),
('WILAYAH PERSEKUTUAN PUTRAJAYA', 'WPJ'),
('SABAH', 'SBH'),
('SARAWAK', 'SRW')
ON DUPLICATE KEY UPDATE kod = VALUES(kod);

-- Create school types reference table
CREATE TABLE IF NOT EXISTS school_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kod VARCHAR(20) NOT NULL UNIQUE COMMENT 'Short code (SK, SMK, etc.)',
    nama VARCHAR(100) NOT NULL COMMENT 'Full name',
    peringkat ENUM('Rendah', 'Menengah', 'Kedua-dua') NOT NULL,
    description TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert school types
INSERT INTO school_types (kod, nama, peringkat) VALUES
('SK', 'Sekolah Kebangsaan', 'Rendah'),
('SK KHAS', 'Sekolah Kebangsaan Khas', 'Rendah'),
('K9', 'K9 School', 'Menengah'),
('SJKC', 'Sekolah Jenis Kebangsaan (Cina)', 'Rendah'),
('SJKT', 'Sekolah Jenis Kebangsaan (Tamil)', 'Rendah'),
('SR SABK', 'Sekolah Rendah Agama Bantuan Kerajaan', 'Rendah'),
('SMK', 'Sekolah Menengah Kebangsaan', 'Menengah'),
('KT6', 'Kolej Tingkatan Enam', 'Menengah'),
('SBP', 'Sekolah Berasrama Penuh', 'Menengah'),
('SENI', 'Sekolah Seni', 'Menengah'),
('MODEL KHAS', 'Sekolah Model Khas', 'Menengah'),
('SM SABK', 'Sekolah Menengah Agama Bantuan Kerajaan', 'Menengah'),
('KV', 'Kolej Vokasional', 'Menengah'),
('SMKA', 'Sekolah Menengah Kebangsaan Agama', 'Menengah'),
('SM KHAS', 'Sekolah Menengah Khas', 'Menengah'),
('SUKAN', 'Sekolah Sukan', 'Menengah'),
('SMT', 'Sekolah Menengah Teknik', 'Menengah'),
('SBJK', 'Sekolah Bantuan JKK', 'Menengah')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT 'School Directory module schema created successfully!' as message;
SELECT CONCAT('Tables created: schools, school_claims, school_officials, school_profiles, school_import_logs, states, school_types') as tables;
