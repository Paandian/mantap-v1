/**
 * SQL Backup Utility for Schools Table
 * Generates SQL dump for backup before bulk operations
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate SQL backup of schools table
 * @param {Object} pool - MySQL connection pool
 * @param {string} backupDir - Directory to save backup (default: ./backups)
 * @returns {Promise<string>} - Path to backup file
 */
async function createSchoolsBackup(pool, backupDir = './backups') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `schools_backup_${timestamp}.sql`;
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupPath = path.join(backupDir, filename);
  
  try {
    // Get all schools data
    const [schools] = await pool.execute(
      `SELECT * FROM schools ORDER BY negeri, bandar, nama_sekolah`
    );
    
    // Generate SQL content
    let sqlContent = `-- Schools Table Backup\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- Total Records: ${schools.length}\n\n`;
    sqlContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;
    sqlContent += `TRUNCATE TABLE schools;\n\n`;
    
    if (schools.length > 0) {
      sqlContent += `INSERT INTO schools (kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis, alamat_surat, poskod, bandar, no_telefon, no_faks, email, lokasi, koordinat_x, koordinat_y, jumlah_murid, jumlah_guru, prasekolah, integrasi, bantuan, status_claim, import_batch) VALUES\n`;
      
      const values = schools.map((school, index) => {
        const row = [
          escapeSQL(school.kod_sekolah),
          escapeSQL(school.nama_sekolah),
          escapeSQL(school.negeri),
          escapeSQL(school.ppd),
          escapeSQL(school.peringkat),
          escapeSQL(school.jenis),
          escapeSQL(school.alamat_surat),
          escapeSQL(school.poskod),
          escapeSQL(school.bandar),
          escapeSQL(school.no_telefon),
          escapeSQL(school.no_faks),
          escapeSQL(school.email),
          escapeSQL(school.lokasi),
          school.koordinat_x || 'NULL',
          school.koordinat_y || 'NULL',
          school.jumlah_murid || 0,
          school.jumlah_guru || 0,
          escapeSQL(school.prasekolah),
          escapeSQL(school.integrasi),
          escapeSQL(school.bantuan),
          escapeSQL(school.status_claim || 'UNCLAIMED'),
          escapeSQL(school.import_batch)
        ];
        
        return `(${row.join(', ')})${index === schools.length - 1 ? ';' : ','}`;
      });
      
      sqlContent += values.join('\n');
      sqlContent += `\n\n`;
    }
    
    sqlContent += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    // Write to file
    fs.writeFileSync(backupPath, sqlContent);
    
    return {
      path: backupPath,
      filename: filename,
      recordCount: schools.length,
      size: fs.statSync(backupPath).size
    };
  } catch (error) {
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

/**
 * Escape string for SQL
 * @param {string} value - Value to escape
 * @returns {string} - Escaped value
 */
function escapeSQL(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

/**
 * List available backups
 * @param {string} backupDir - Backup directory
 * @returns {Array} - List of backup files
 */
function listBackups(backupDir = './backups') {
  if (!fs.existsSync(backupDir)) {
    return [];
  }
  
  return fs.readdirSync(backupDir)
    .filter(file => file.startsWith('schools_backup_') && file.endsWith('.sql'))
    .map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      return {
        filename: file,
        created: stats.mtime,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size)
      };
    })
    .sort((a, b) => b.created - a.created);
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes to format
 * @returns {string} - Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Restore schools table from backup
 * @param {Object} pool - MySQL connection pool
 * @param {string} backupFilename - Backup filename
 * @param {string} backupDir - Backup directory
 * @returns {Promise<Object>} - Restore result
 */
async function restoreFromBackup(pool, backupFilename, backupDir = './backups') {
  const backupPath = path.join(backupDir, backupFilename);
  
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupFilename}`);
  }
  
  try {
    const sqlContent = fs.readFileSync(backupPath, 'utf8');
    
    // Execute SQL statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      if (statement && !statement.startsWith('--') && !statement.startsWith('/*')) {
        await pool.execute(statement + ';');
      }
    }
    
    return {
      success: true,
      message: 'Backup restored successfully',
      filename: backupFilename
    };
  } catch (error) {
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
}

module.exports = {
  createSchoolsBackup,
  listBackups,
  restoreFromBackup,
  formatBytes
};