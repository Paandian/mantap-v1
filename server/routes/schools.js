const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const enhancedImportController = require('../controllers/enhancedImportController');
const backupManagementController = require('../controllers/backupManagementController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Get all schools with filters
router.get('/', schoolController.getSchools);

// Get filter options (states, types, etc.) - MUST come before /:id
router.get('/filters/options', schoolController.getFilterOptions);

// Get single school
router.get('/:id', schoolController.getSchoolById);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Submit school claim
router.post('/:id/claim', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { fullName, position, email, phone } = req.body;

        const pool = require('../config/db');
        
        // Check if school exists
        const [schoolRows] = await pool.execute(
            'SELECT status_claim FROM schools WHERE id = ?',
            [id]
        );

        if (schoolRows.length === 0) {
            return res.status(404).json({ message: 'School not found' });
        }

        if (schoolRows[0].status_claim !== 'UNCLAIMED') {
            return res.status(400).json({ message: 'School is already claimed or pending' });
        }

        // Check if user already has pending claim
        const [existingClaim] = await pool.execute(
            'SELECT id FROM school_claims WHERE school_id = ? AND user_id = ? AND status = "PENDING"',
            [id, userId]
        );

        if (existingClaim.length > 0) {
            return res.status(400).json({ message: 'You already have a pending claim for this school' });
        }

        // Create claim request
        await pool.execute(
            `INSERT INTO school_claims (school_id, user_id, full_name, position, email, phone)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, userId, fullName, position, email, phone]
        );

        // Update school status to pending
        await pool.execute(
            'UPDATE schools SET status_claim = "PENDING" WHERE id = ?',
            [id]
        );

        res.status(201).json({ message: 'Claim request submitted successfully' });
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({ message: 'Failed to submit claim' });
    }
});

// Get user's claims
router.get('/my/claims', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = require('../config/db');

        const [claims] = await pool.execute(
            `SELECT sc.*, s.nama_sekolah, s.kod_sekolah, s.negeri
             FROM school_claims sc
             JOIN schools s ON sc.school_id = s.id
             WHERE sc.user_id = ?
             ORDER BY sc.submitted_at DESC`,
            [userId]
        );

        res.json({ claims });
    } catch (error) {
        console.error('Error fetching user claims:', error);
        res.status(500).json({ message: 'Failed to fetch claims' });
    }
});

// ============================================
// ADMIN ROUTES (Admin/Super-admin only)
// ============================================

// Create school
router.post('/', authenticateToken, requireRole(['super-admin', 'admin', 'creator']), schoolController.createSchool);

// Update school
router.put('/:id', authenticateToken, requireRole(['super-admin', 'admin', 'creator']), schoolController.updateSchool);

// Delete school
router.delete('/:id', authenticateToken, requireRole(['super-admin', 'admin', 'creator']), schoolController.deleteSchool);

// Bulk delete
router.post('/bulk-delete', authenticateToken, requireRole(['super-admin', 'admin']), schoolController.bulkDeleteSchools);

// Get claims (admin)
router.get('/admin/claims', authenticateToken, requireRole(['super-admin', 'admin', 'creator']), schoolController.getClaims);

// Approve claim
router.post('/admin/claims/:claimId/approve', authenticateToken, requireRole(['super-admin', 'admin']), schoolController.approveClaim);

// Reject claim
router.post('/admin/claims/:claimId/reject', authenticateToken, requireRole(['super-admin', 'admin']), schoolController.rejectClaim);

// Get import history
router.get('/admin/import-history', authenticateToken, requireRole(['super-admin', 'admin']), schoolController.getImportHistory);

// Bulk import schools from Excel
const multer = require('multer');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.originalname.endsWith('.xlsx') ||
            file.originalname.endsWith('.xls')) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'));
        }
    }
});

router.post('/admin/import', 
    authenticateToken, 
    requireRole(['super-admin', 'admin']), 
    upload.single('file'), 
    schoolController.bulkImportSchools
);

// ============================================
// ENHANCED BULK IMPORT ROUTES (New System)
// ============================================

// Step 1: Validate and preview import data
router.post('/admin/import/validate',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    upload.single('file'),
    enhancedImportController.validateImportData
);

// Step 2: Execute import with strategy
router.post('/admin/import/execute',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    upload.single('file'),
    enhancedImportController.executeBulkImport
);

// ============================================
// BACKUP MANAGEMENT ROUTES
// ============================================

// IMPORTANT: These routes must come BEFORE the '/admin/import/backups/:filename' route
// Otherwise Express will treat "list", "stats", "cleanup" as filenames

// List all backups with details
router.get('/admin/import/backups/list',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    backupManagementController.listAllBackups
);

// Auto cleanup old backups
router.delete('/admin/import/backups/cleanup',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    backupManagementController.cleanupBackups
);

// Get backup statistics
router.get('/admin/import/backups/stats',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    backupManagementController.getBackupStats
);

// Restore database from backup
router.post('/admin/import/backups/:filename/restore',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    backupManagementController.restoreBackup
);

// Delete specific backup
router.delete('/admin/import/backups/:filename',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    backupManagementController.deleteBackup
);

// List available backups (basic - old controller)
router.get('/admin/import/backups',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    enhancedImportController.listBackups
);

// Download backup file
router.get('/admin/import/backups/:filename',
    authenticateToken,
    requireRole(['super-admin', 'admin']),
    enhancedImportController.downloadBackup
);

module.exports = router;
