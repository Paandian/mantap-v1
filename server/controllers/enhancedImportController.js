/**
 * Enhanced Bulk Import Controller
 * Features:
 * - Smart name normalization (negeri + bandar)
 * - Pre-import validation & preview
 * - Import strategy options (merge/drop/backup)
 * - SQL backup generation
 * - Progress tracking
 */

const pool = require('../config/db');
const { 
  normalizeNegeri, 
  normalizeBandar, 
  normalizeSchoolLocation,
  isValidNegeri,
  getNormalizationStats 
} = require('../utils/nameNormalizer');
const { createSchoolsBackup, listBackups } = require('../utils/backupUtils');

/**
 * Step 1: Validate and Preview Import Data
 * POST /api/schools/import/validate
 */
exports.validateImportData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get database stats FIRST (before any long operations that could timeout)
    let currentTotal = 0;
    try {
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM schools');
      currentTotal = countResult[0].total;
    } catch (dbError) {
      console.error('Warning: Could not get database count:', dbError.message);
    }

    const XLSX = require('xlsx');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Parse Excel data
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 'A', range: 2 });
    
    // Map and validate data
    const schoolsData = data.filter((row, index) => {
      return index > 1 && row['F'] && row['G'] && row['F'] !== 'KODSEKOLAH';
    }).map(row => ({
      kod_sekolah: String(row['F'] || '').trim(),
      nama_sekolah: String(row['G'] || '').trim(),
      negeri: String(row['B'] || '').trim(),
      ppd: String(row['C'] || '').trim(),
      peringkat: String(row['D'] || 'Rendah').trim(),
      jenis: String(row['E'] || '').trim(),
      alamat_surat: String(row['H'] || '').trim(),
      poskod: String(row['I'] || '').trim(),
      bandar: String(row['J'] || '').trim(),
      no_telefon: String(row['K'] || '').trim(),
      no_faks: String(row['L'] || '').trim(),
      email: String(row['M'] || '').trim(),
      lokasi: String(row['N'] || 'Bandar').trim(),
      koordinat_x: parseFloat(row['T']) || null,
      koordinat_y: parseFloat(row['U']) || null,
      jumlah_murid: parseInt(row['P']) || 0,
      jumlah_guru: parseInt(row['Q']) || 0,
      prasekolah: String(row['R'] || 'TIADA').trim(),
      integrasi: String(row['S'] || 'TIADA').trim(),
      bantuan: String(row['O'] || '').trim()
    }));

    // Apply smart normalization
    const normalizedData = schoolsData.map(school => ({
      ...school,
      original_negeri: school.negeri,
      original_bandar: school.bandar,
      negeri: normalizeNegeri(school.negeri),
      bandar: normalizeBandar(school.bandar)
    }));

    // Get statistics
    const stats = getNormalizationStats(normalizedData);

    res.json({
      success: true,
      preview: {
        totalRows: schoolsData.length,
        sample: normalizedData.slice(0, 5),
        normalizationStats: stats,
        existingSchools: [], // Skip this check to avoid timeout
        existingCount: 0,
        currentDatabaseTotal: currentTotal
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      message: 'Failed to validate import data', 
      error: error.message 
    });
  }
};

/**
 * Step 2: Execute Bulk Import with Strategy
 * POST /api/schools/import/execute
 * Body: { strategy: 'merge' | 'drop_and_import' | 'backup_and_drop', backupFilename: '' }
 */
exports.executeBulkImport = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { strategy = 'merge', backupFilename } = req.body;
  
  console.log('Bulk import started:', { userId, strategy });
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate strategy
    const validStrategies = ['merge', 'drop_and_import', 'backup_and_drop'];
    if (!validStrategies.includes(strategy)) {
      return res.status(400).json({ 
        message: 'Invalid strategy. Use: merge, drop_and_import, or backup_and_drop' 
      });
    }

    let backupResult = null;

    // Step 1: Create backup if requested
    if (strategy === 'backup_and_drop' || backupFilename) {
      try {
        backupResult = await createSchoolsBackup(pool);
        console.log('Backup created:', backupResult.filename);
      } catch (backupError) {
        console.error('Backup creation failed:', backupError);
        return res.status(500).json({
          message: 'Failed to create backup. Import aborted for safety.',
          error: backupError.message
        });
      }
    }

    // Step 2: Handle drop strategy
    if (strategy === 'drop_and_import' || strategy === 'backup_and_drop') {
      try {
        await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
        await pool.execute('TRUNCATE TABLE schools');
        await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Schools table truncated');
      } catch (truncateError) {
        console.error('Truncate failed:', truncateError);
        return res.status(500).json({
          message: 'Failed to clear existing data',
          error: truncateError.message,
          backup: backupResult
        });
      }
    }

    // Step 3: Parse Excel
    const XLSX = require('xlsx');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 'A', range: 2 });
    
    const schoolsData = data.filter((row, index) => {
      return index > 1 && row['F'] && row['G'] && row['F'] !== 'KODSEKOLAH';
    }).map(row => ({
      KODSEKOLAH: row['F'],
      NAMASEKOLAH: row['G'],
      NEGERI: row['B'],
      PPD: row['C'],
      PERINGKAT: row['D'],
      JENIS: row['E'],
      ALAMATSURAT: row['H'],
      POSKODSURAT: row['I'],
      BANDARSURAT: row['J'],
      NOTELEFON: row['K'],
      NOFAX: row['L'],
      EMAIL: row['M'],
      LOKASI: row['N'],
      BANTUAN: row['O'],
      MURID: row['P'],
      GURU: row['Q'],
      PRASEKOLAH: row['R'],
      INTEGRASI: row['S'],
      KOORDINATXX: row['T'],
      KOORDINATYY: row['U']
    }));

    const batchId = `BATCH_${Date.now()}`;
    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];
    const normalizationLog = {
      negeri: {},
      bandar: {}
    };

    // Start import log (handle backwards compatibility for strategy column)
    let logId;
    try {
      // Try with strategy column (new schema)
      const [logResult] = await pool.execute(
        `INSERT INTO school_import_logs (batch_id, filename, total_records, imported_by, started_at, strategy)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        [batchId, req.file.originalname, schoolsData.length, userId, strategy]
      );
      logId = logResult.insertId;
    } catch (columnError) {
      // Fallback to old schema without strategy column
      if (columnError.code === 'ER_BAD_FIELD_ERROR') {
        const [logResult] = await pool.execute(
          `INSERT INTO school_import_logs (batch_id, filename, total_records, imported_by, started_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [batchId, req.file.originalname, schoolsData.length, userId]
        );
        logId = logResult.insertId;
      } else {
        throw columnError;
      }
    }

    // Process each school with smart normalization
    for (let i = 0; i < schoolsData.length; i++) {
      const row = schoolsData[i];
      
      try {
        let schoolData = {
          kod_sekolah: String(row['KODSEKOLAH'] || '').trim(),
          nama_sekolah: String(row['NAMASEKOLAH'] || '').trim(),
          negeri: String(row['NEGERI'] || '').trim(),
          ppd: String(row['PPD'] || '').trim(),
          peringkat: String(row['PERINGKAT'] || 'Rendah').trim(),
          jenis: String(row['JENIS'] || '').trim(),
          alamat_surat: String(row['ALAMATSURAT'] || '').trim(),
          poskod: String(row['POSKODSURAT'] || '').trim(),
          bandar: String(row['BANDARSURAT'] || '').trim(),
          no_telefon: String(row['NOTELEFON'] || '').trim(),
          no_faks: String(row['NOFAX'] || '').trim(),
          email: String(row['EMAIL'] || '').trim(),
          lokasi: String(row['LOKASI'] || 'Bandar').trim(),
          koordinat_x: parseFloat(row['KOORDINATXX']) || null,
          koordinat_y: parseFloat(row['KOORDINATYY']) || null,
          jumlah_murid: parseInt(row['MURID']) || 0,
          jumlah_guru: parseInt(row['GURU']) || 0,
          prasekolah: String(row['PRASEKOLAH'] || 'TIADA').trim(),
          integrasi: String(row['INTEGRASI'] || 'TIADA').trim(),
          bantuan: String(row['BANTUAN'] || '').trim(),
          import_batch: batchId
        };

        // Apply smart normalization
        const originalNegeri = schoolData.negeri;
        const originalBandar = schoolData.bandar;
        
        schoolData = normalizeSchoolLocation(schoolData);
        
        // Log normalization
        if (originalNegeri !== schoolData.negeri) {
          normalizationLog.negeri[originalNegeri] = schoolData.negeri;
        }
        if (originalBandar !== schoolData.bandar) {
          normalizationLog.bandar[originalBandar] = schoolData.bandar;
        }

        // Normalize peringkat
        if (schoolData.peringkat) {
          const peringkatLower = schoolData.peringkat.toLowerCase();
          if (peringkatLower.includes('rendah')) {
            schoolData.peringkat = 'Rendah';
          } else if (peringkatLower.includes('menengah')) {
            schoolData.peringkat = 'Menengah';
          }
        }

        if (!schoolData.kod_sekolah || !schoolData.nama_sekolah) {
          throw new Error('Missing required fields: kod_sekolah or nama_sekolah');
        }

        // Check if school exists
        const [existing] = await pool.execute(
          'SELECT id FROM schools WHERE kod_sekolah = ?',
          [schoolData.kod_sekolah]
        );

        if (existing.length > 0 && strategy === 'merge') {
          // Update existing school
          await pool.execute(
            `UPDATE schools SET
              nama_sekolah = ?, negeri = ?, ppd = ?, peringkat = ?, jenis = ?,
              alamat_surat = ?, poskod = ?, bandar = ?, no_telefon = ?, no_faks = ?,
              email = ?, lokasi = ?, koordinat_x = ?, koordinat_y = ?,
              jumlah_murid = ?, jumlah_guru = ?, prasekolah = ?, integrasi = ?,
              bantuan = ?, import_batch = ?, imported_at = NOW()
             WHERE kod_sekolah = ?`,
            [
              schoolData.nama_sekolah, schoolData.negeri, schoolData.ppd,
              schoolData.peringkat, schoolData.jenis, schoolData.alamat_surat,
              schoolData.poskod, schoolData.bandar, schoolData.no_telefon,
              schoolData.no_faks, schoolData.email, schoolData.lokasi,
              schoolData.koordinat_x, schoolData.koordinat_y, schoolData.jumlah_murid,
              schoolData.jumlah_guru, schoolData.prasekolah, schoolData.integrasi,
              schoolData.bantuan, schoolData.import_batch, schoolData.kod_sekolah
            ]
          );
          updated++;
        } else {
          // Insert new school (or replace if drop strategy)
          await pool.execute(
            `INSERT INTO schools (kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis,
              alamat_surat, poskod, bandar, no_telefon, no_faks, email, lokasi,
              koordinat_x, koordinat_y, jumlah_murid, jumlah_guru, prasekolah,
              integrasi, bantuan, status_claim, import_batch)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNCLAIMED', ?)`,
            [
              schoolData.kod_sekolah, schoolData.nama_sekolah, schoolData.negeri,
              schoolData.ppd, schoolData.peringkat, schoolData.jenis, schoolData.alamat_surat,
              schoolData.poskod, schoolData.bandar, schoolData.no_telefon,
              schoolData.no_faks, schoolData.email, schoolData.lokasi,
              schoolData.koordinat_x, schoolData.koordinat_y, schoolData.jumlah_murid,
              schoolData.jumlah_guru, schoolData.prasekolah, schoolData.integrasi,
              schoolData.bantuan, schoolData.import_batch
            ]
          );
          imported++;
        }

      } catch (err) {
        failed++;
        errors.push(`Row ${i + 1}: ${err.message}`);
        console.error(`Error importing row ${i + 1}:`, err);
      }
    }

    // Update import log (handle backwards compatibility)
    try {
      // Try with normalization_log column (new schema)
      await pool.execute(
        `UPDATE school_import_logs SET
          imported_records = ?, updated_records = ?, failed_records = ?, 
          errors = ?, completed_at = NOW(), normalization_log = ?
         WHERE id = ?`,
        [imported, updated, failed, errors.slice(0, 50).join('\n'), 
         JSON.stringify(normalizationLog), logId]
      );
    } catch (columnError) {
      // Fallback to old schema without normalization_log column
      if (columnError.code === 'ER_BAD_FIELD_ERROR') {
        await pool.execute(
          `UPDATE school_import_logs SET
            imported_records = ?, updated_records = ?, failed_records = ?, 
            errors = ?, completed_at = NOW()
           WHERE id = ?`,
          [imported, updated, failed, errors.slice(0, 50).join('\n'), logId]
        );
      } else {
        throw columnError;
      }
    }

    console.log(`Import completed: ${imported} imported, ${updated} updated, ${failed} failed`);

    res.json({
      success: true,
      batchId,
      strategy,
      total: schoolsData.length,
      imported,
      updated,
      failed,
      backup: backupResult,
      normalization: normalizationLog,
      errors: errors.slice(0, 10)
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ 
      message: 'Failed to import schools', 
      error: error.message 
    });
  }
};

/**
 * List available backups
 * GET /api/schools/import/backups
 */
exports.listBackups = async (req, res) => {
  try {
    const backups = listBackups();
    res.json({
      success: true,
      backups
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to list backups',
      error: error.message
    });
  }
};

/**
 * Download backup file
 * GET /api/schools/import/backups/:filename
 */
exports.downloadBackup = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const backupDir = './backups';
    const filename = req.params.filename;
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }
    
    const filePath = path.join(backupDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to download backup',
      error: error.message
    });
  }
};