-- Fix: Drop schools table with foreign key constraints
-- Run this in MySQL/phpMyAdmin

SET FOREIGN_KEY_CHECKS = 0;

-- Drop dependent tables first
DROP TABLE IF EXISTS school_claims;
DROP TABLE IF EXISTS school_officials;
DROP TABLE IF EXISTS school_profiles;
DROP TABLE IF EXISTS school_import_logs;

-- Now drop schools table
DROP TABLE IF EXISTS schools;

-- Re-create schools table with full schema
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kod_sekolah VARCHAR(20) UNIQUE NOT NULL,
    nama_sekolah VARCHAR(255) NOT NULL,
    negeri VARCHAR(100) NOT NULL,
    ppd VARCHAR(255),
    peringkat ENUM('Rendah', 'Menengah') NOT NULL,
    jenis VARCHAR(50) NOT NULL,
    alamat_surat TEXT,
    poskod VARCHAR(10),
    bandar VARCHAR(100),
    no_telefon VARCHAR(20),
    no_faks VARCHAR(20),
    email VARCHAR(255),
    lokasi ENUM('Bandar', 'Luar Bandar'),
    koordinat_x DECIMAL(12, 8),
    koordinat_y DECIMAL(12, 8),
    jumlah_murid INT DEFAULT 0,
    jumlah_guru INT DEFAULT 0,
    prasekolah VARCHAR(10) DEFAULT 'TIADA',
    integrasi VARCHAR(10) DEFAULT 'TIADA',
    bantuan VARCHAR(50),
    status_claim ENUM('UNCLAIMED', 'PENDING', 'CLAIMED', 'REJECTED') DEFAULT 'UNCLAIMED',
    claimed_by INT DEFAULT NULL,
    claimed_at TIMESTAMP NULL,
    verified_by INT DEFAULT NULL,
    verified_at TIMESTAMP NULL,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    import_batch VARCHAR(50),
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    INDEX idx_kod_sekolah (kod_sekolah),
    INDEX idx_negeri (negeri),
    INDEX idx_peringkat (peringkat),
    INDEX idx_jenis (jenis),
    INDEX idx_status_claim (status_claim),
    FULLTEXT INDEX idx_nama_sekolah (nama_sekolah)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-create dependent tables
CREATE TABLE school_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    document_url VARCHAR(500),
    document_type VARCHAR(50),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    admin_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT DEFAULT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_school_user_claim (school_id, user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE school_officials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    jawatan VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    no_telefon VARCHAR(20),
    gambar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_school (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE school_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL UNIQUE,
    description TEXT,
    visi TEXT,
    misi TEXT,
    moto VARCHAR(255),
    facilities JSON,
    achievements JSON,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    gallery JSON,
    website VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    school_hours VARCHAR(100),
    session ENUM('Pagi', 'Petang', 'Pagi & Petang') DEFAULT 'Pagi',
    last_updated_by INT,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (last_updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE school_import_logs (
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
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_batch (batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reference tables
CREATE TABLE IF NOT EXISTS states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    kod VARCHAR(10),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS school_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kod VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    peringkat ENUM('Rendah', 'Menengah', 'Kedua-dua') NOT NULL,
    description TEXT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert states
INSERT INTO states (nama, kod) VALUES
('JOHOR', 'JHR'), ('KEDAH', 'KDH'), ('KELANTAN', 'KEL'), ('MELAKA', 'MLK'),
('NEGERI SEMBILAN', 'NSN'), ('PAHANG', 'PHG'), ('PERAK', 'PRK'), ('PERLIS', 'PLS'),
('PULAU PINANG', 'PNG'), ('SABAH', 'SBH'), ('SARAWAK', 'SRW'), ('SELANGOR', 'SGR'),
('TERENGGANU', 'TRG'), ('WILAYAH PERSEKUTUAN KUALA LUMPUR', 'WPKL'),
('WILAYAH PERSEKUTUAN LABUAN', 'WPL'), ('WILAYAH PERSEKUTUAN PUTRAJAYA', 'WPJ')
ON DUPLICATE KEY UPDATE kod = VALUES(kod);

-- Insert school types
INSERT INTO school_types (kod, nama, peringkat) VALUES
('SK', 'Sekolah Kebangsaan', 'Rendah'), ('SK KHAS', 'Sekolah Kebangsaan Khas', 'Rendah'),
('SJKC', 'Sekolah Jenis Kebangsaan (Cina)', 'Rendah'), ('SJKT', 'Sekolah Jenis Kebangsaan (Tamil)', 'Rendah'),
('SR SABK', 'Sekolah Rendah Agama Bantuan Kerajaan', 'Rendah'), ('SMK', 'Sekolah Menengah Kebangsaan', 'Menengah'),
('SMKA', 'Sekolah Menengah Kebangsaan Agama', 'Menengah'), ('SBP', 'Sekolah Berasrama Penuh', 'Menengah'),
('KV', 'Kolej Vokasional', 'Menengah'), ('SMT', 'Sekolah Menengah Teknik', 'Menengah'),
('SENI', 'Sekolah Seni', 'Menengah'), ('SUKAN', 'Sekolah Sukan', 'Menengah')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Schools database recreated successfully!' as message;
