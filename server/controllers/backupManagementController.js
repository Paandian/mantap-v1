/**
 * Backup Management API
 * Manage SQL backup files for schools table
 */

const fs = require('fs');
const path = require('path');
const { listBackups, restoreFromBackup, formatBytes } = require('../utils/backupUtils');
const pool = require('../config/db');

/**
 * List all backups with details
 * GET /api/schools/admin/import/backups/list
 */
exports.listAllBackups = async (req, res) => {
  try {
    const backupDir = './backups';
    const backups = listBackups(backupDir);
    
    // Calculate total size
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
    
    res.json({
      success: true,
      backups: backups.map(b => ({
        filename: b.filename,
        created: b.created,
        size: b.sizeFormatted,
        recordCount: b.recordCount || 'Unknown'
      })),
      totalBackups: backups.length,
      totalSize: formatBytes(totalSize),
      backupDirectory: path.resolve(backupDir)
    });
  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list backups',
      error: error.message
    });
  }
};

/**
 * Delete specific backup
 * DELETE /api/schools/admin/import/backups/:filename
 */
exports.deleteBackup = async (req, res) => {
  try {
    const fs = require('fs');
    const backupDir = './backups';
    const filename = req.params.filename;
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(backupDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    // Get file info before deleting
    const stats = fs.statSync(filePath);
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: `Backup ${filename} deleted successfully`,
      deletedFile: {
        filename: filename,
        size: formatBytes(stats.size),
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete backup',
      error: error.message
    });
  }
};

/**
 * Restore database from backup
 * POST /api/schools/admin/import/backups/:filename/restore
 */
exports.restoreBackup = async (req, res) => {
  try {
    const filename = req.params.filename;
    const backupDir = './backups';
    
    console.log(`Starting restore from backup: ${filename}`);
    
    // Perform restore
    const result = await restoreFromBackup(pool, filename, backupDir);
    
    // Get current count after restore
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM schools');
    const currentTotal = countResult[0].total;
    
    res.json({
      success: true,
      message: 'Database restored successfully',
      backup: filename,
      currentSchoolCount: currentTotal,
      restoredAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore backup',
      error: error.message
    });
  }
};

/**
 * Auto cleanup old backups
 * DELETE /api/schools/admin/import/backups/cleanup
 * Query params: keepDays (default: 30), keepCount (default: 10)
 */
exports.cleanupBackups = async (req, res) => {
  try {
    const fs = require('fs');
    const backupDir = './backups';
    const keepDays = parseInt(req.query.keepDays) || 30;
    const keepCount = parseInt(req.query.keepCount) || 10;
    
    console.log(`Starting backup cleanup: keep ${keepDays} days, keep ${keepCount} latest`);
    
    const backups = listBackups(backupDir);
    const now = new Date();
    const deletedFiles = [];
    let freedSpace = 0;
    
    // Sort by date (oldest first)
    backups.sort((a, b) => a.created - b.created);
    
    backups.forEach((backup, index) => {
      const ageInDays = (now - backup.created) / (1000 * 60 * 60 * 24);
      const isOld = ageInDays > keepDays;
      const exceedsCount = backups.length - index > keepCount;
      
      if (isOld || exceedsCount) {
        const filePath = path.join(backupDir, backup.filename);
        try {
          fs.unlinkSync(filePath);
          deletedFiles.push({
            filename: backup.filename,
            size: backup.sizeFormatted,
            age: Math.round(ageInDays)
          });
          freedSpace += backup.size;
        } catch (err) {
          console.error(`Failed to delete ${backup.filename}:`, err);
        }
      }
    });
    
    res.json({
      success: true,
      message: `Cleanup completed: ${deletedFiles.length} backups deleted`,
      deletedFiles: deletedFiles,
      freedSpace: formatBytes(freedSpace),
      remainingBackups: backups.length - deletedFiles.length,
      cleanupRules: {
        maxAgeDays: keepDays,
        maxCount: keepCount
      }
    });
  } catch (error) {
    console.error('Cleanup backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup backups',
      error: error.message
    });
  }
};

/**
 * Get backup statistics
 * GET /api/schools/admin/import/backups/stats
 */
exports.getBackupStats = async (req, res) => {
  try {
    const backupDir = './backups';
    const backups = listBackups(backupDir);
    
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
    const oldestBackup = backups.length > 0 ? backups[backups.length - 1] : null;
    const newestBackup = backups.length > 0 ? backups[0] : null;
    
    res.json({
      success: true,
      stats: {
        totalBackups: backups.length,
        totalSize: formatBytes(totalSize),
        oldestBackup: oldestBackup ? {
          filename: oldestBackup.filename,
          date: oldestBackup.created
        } : null,
        newestBackup: newestBackup ? {
          filename: newestBackup.filename,
          date: newestBackup.created
        } : null,
        averageBackupSize: backups.length > 0 
          ? formatBytes(totalSize / backups.length) 
          : '0 Bytes'
      }
    });
  } catch (error) {
    console.error('Backup stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get backup stats',
      error: error.message
    });
  }
};