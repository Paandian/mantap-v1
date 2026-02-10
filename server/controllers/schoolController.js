const pool = require('../config/db');

// ============================================
// PUBLIC ENDPOINTS (No authentication required)
// ============================================

// Get all schools with filters and pagination
exports.getSchools = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            negeri = '',
            peringkat = '',
            jenis = '',
            ppd = '',
            bandar = '',
            claimed = '',
            sortBy = 'nama_sekolah',
            sortOrder = 'ASC'
        } = req.query;

        let whereClause = 'WHERE 1=1';
        const params = [];
        
        // Ensure params is always an array (defensive coding for production)
        if (!Array.isArray(params)) {
            console.error('Params is not an array:', params);
        }

        if (search) {
            whereClause += ' AND (nama_sekolah LIKE ? OR kod_sekolah LIKE ? OR ppd LIKE ? OR alamat_surat LIKE ? OR bandar LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (negeri) {
            whereClause += ' AND negeri = ?';
            params.push(negeri);
        }

        if (peringkat) {
            whereClause += ' AND peringkat = ?';
            params.push(peringkat);
        }

        if (jenis) {
            whereClause += ' AND jenis = ?';
            params.push(jenis);
        }

        if (ppd) {
            whereClause += ' AND ppd = ?';
            params.push(ppd);
        }

        if (bandar) {
            whereClause += ' AND bandar = ?';
            params.push(bandar);
        }

        if (claimed === 'true') {
            whereClause += ' AND status_claim = "CLAIMED"';
        } else if (claimed === 'false') {
            whereClause += ' AND status_claim = "UNCLAIMED"';
        }

        // Get total count
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM schools ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get schools
        const offset = (page - 1) * limit;
        
        // Handle sortBy that may already contain direction (e.g., "nama_sekolah DESC")
        let orderByClause;
        if (sortBy.includes(' ')) {
            // sortBy already has direction included (e.g., "nama_sekolah DESC")
            orderByClause = sortBy;
        } else {
            // sortBy is just column name, append sortOrder
            orderByClause = `${sortBy} ${sortOrder}`;
        }
        
        // Use string interpolation for LIMIT/OFFSET to avoid MySQL prepared statement issues
        const safeLimit = parseInt(limit) || 20;
        const safeOffset = parseInt(offset) || 0;
        
        const [rows] = await pool.execute(
            `SELECT id, kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis,
                    bandar, lokasi, status_claim, logo_url, banner_url,
                    jumlah_murid, jumlah_guru
             FROM schools 
             ${whereClause}
             ORDER BY ${orderByClause}
             LIMIT ${safeLimit} OFFSET ${safeOffset}`,
            params
        );

        res.json({
            schools: rows,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ message: 'Failed to fetch schools' });
    }
};

// Get single school by ID (public view)
exports.getSchoolById = async (req, res) => {
    try {
        const { id } = req.params;

        const [schoolRows] = await pool.execute(
            `SELECT s.*, sp.description, sp.visi, sp.misi, sp.moto, 
                    sp.facilities, sp.achievements, sp.gallery,
                    sp.website, sp.facebook, sp.instagram, sp.youtube,
                    sp.school_hours, sp.session
             FROM schools s
             LEFT JOIN school_profiles sp ON s.id = sp.school_id
             WHERE s.id = ?`,
            [id]
        );

        if (schoolRows.length === 0) {
            return res.status(404).json({ message: 'School not found' });
        }

        const school = schoolRows[0];

        // Get officials if school is claimed
        if (school.status_claim === 'CLAIMED') {
            const [officials] = await pool.execute(
                `SELECT nama, jawatan, email, no_telefon, gambar_url, is_primary_contact
                 FROM school_officials 
                 WHERE school_id = ? AND is_active = TRUE
                 ORDER BY is_primary_contact DESC, created_at ASC`,
                [id]
            );
            school.officials = officials;
        }

        res.json({ school });
    } catch (error) {
        console.error('Error fetching school:', error);
        res.status(500).json({ message: 'Failed to fetch school' });
    }
};

// Get filter options (states, types, PPDs, cities)
exports.getFilterOptions = async (req, res) => {
    try {
        // Get states with counts
        const [states] = await pool.execute(
            'SELECT negeri, COUNT(*) as count FROM schools WHERE negeri IS NOT NULL GROUP BY negeri ORDER BY negeri'
        );

        // Get school types
        const [types] = await pool.execute(
            'SELECT DISTINCT jenis FROM schools ORDER BY jenis'
        );

        // Get PPDs
        const [ppds] = await pool.execute(
            'SELECT DISTINCT ppd FROM schools WHERE ppd IS NOT NULL ORDER BY ppd'
        );

        // Get cities (bandar) grouped by PPD
        const [cities] = await pool.execute(
            'SELECT DISTINCT ppd, bandar FROM schools WHERE bandar IS NOT NULL AND ppd IS NOT NULL ORDER BY ppd, bandar'
        );

        // Group cities by PPD
        const citiesByPPD = {};
        cities.forEach(row => {
            if (!citiesByPPD[row.ppd]) {
                citiesByPPD[row.ppd] = [];
            }
            citiesByPPD[row.ppd].push(row.bandar);
        });

        // Create negeri counts object
        const negeriCounts = {};
        states.forEach(state => {
            negeriCounts[state.negeri] = state.count;
        });

        res.json({
            negeris: states.map(s => s.negeri),
            states: states.map(s => s.negeri),
            types: types.map(t => t.jenis),
            ppds: ppds.map(p => p.ppd),
            peringkat: ['Rendah', 'Menengah'],
            cities: citiesByPPD,
            negeriCounts: negeriCounts
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ message: 'Failed to fetch filter options' });
    }
};

// ============================================
// ADMIN ENDPOINTS (Authentication required)
// ============================================

// Create new school
exports.createSchool = async (req, res) => {
    try {
        const schoolData = req.body;
        
        const [result] = await pool.execute(
            `INSERT INTO schools (kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis,
                                alamat_surat, poskod, bandar, no_telefon, no_faks, email,
                                lokasi, koordinat_x, koordinat_y, jumlah_murid, jumlah_guru,
                                prasekolah, integrasi, bantuan, status_claim)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UNCLAIMED')`,
            [
                schoolData.kod_sekolah, schoolData.nama_sekolah, schoolData.negeri,
                schoolData.ppd, schoolData.peringkat, schoolData.jenis,
                schoolData.alamat_surat, schoolData.poskod, schoolData.bandar,
                schoolData.no_telefon, schoolData.no_faks, schoolData.email,
                schoolData.lokasi, schoolData.koordinat_x, schoolData.koordinat_y,
                schoolData.jumlah_murid || 0, schoolData.jumlah_guru || 0,
                schoolData.prasekolah, schoolData.integrasi, schoolData.bantuan
            ]
        );

        res.status(201).json({
            message: 'School created successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error creating school:', error);
        res.status(500).json({ message: 'Failed to create school' });
    }
};

// Update school
exports.updateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolData = req.body;

        await pool.execute(
            `UPDATE schools SET
                kod_sekolah = ?, nama_sekolah = ?, negeri = ?, ppd = ?, 
                peringkat = ?, jenis = ?, alamat_surat = ?, poskod = ?,
                bandar = ?, no_telefon = ?, no_faks = ?, email = ?,
                lokasi = ?, koordinat_x = ?, koordinat_y = ?,
                jumlah_murid = ?, jumlah_guru = ?, prasekolah = ?,
                integrasi = ?, bantuan = ?
             WHERE id = ?`,
            [
                schoolData.kod_sekolah, schoolData.nama_sekolah, schoolData.negeri,
                schoolData.ppd, schoolData.peringkat, schoolData.jenis,
                schoolData.alamat_surat, schoolData.poskod, schoolData.bandar,
                schoolData.no_telefon, schoolData.no_faks, schoolData.email,
                schoolData.lokasi, schoolData.koordinat_x, schoolData.koordinat_y,
                schoolData.jumlah_murid, schoolData.jumlah_guru,
                schoolData.prasekolah, schoolData.integrasi, schoolData.bantuan, id
            ]
        );

        res.json({ message: 'School updated successfully' });
    } catch (error) {
        console.error('Error updating school:', error);
        res.status(500).json({ message: 'Failed to update school' });
    }
};

// Delete school
exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.execute('DELETE FROM schools WHERE id = ?', [id]);

        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error('Error deleting school:', error);
        res.status(500).json({ message: 'Failed to delete school' });
    }
};

// Bulk delete schools
exports.bulkDeleteSchools = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No school IDs provided' });
        }

        const placeholders = ids.map(() => '?').join(',');
        await pool.execute(`DELETE FROM schools WHERE id IN (${placeholders})`, ids);

        res.json({ message: `${ids.length} schools deleted successfully` });
    } catch (error) {
        console.error('Error bulk deleting schools:', error);
        res.status(500).json({ message: 'Failed to delete schools' });
    }
};

// ============================================
// SCHOOL CLAIM MANAGEMENT
// ============================================

// Get all claim requests
exports.getClaims = async (req, res) => {
    try {
        const { status = 'PENDING', page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;
        
        const [claims] = await pool.execute(
            `SELECT sc.*, s.nama_sekolah, s.kod_sekolah, s.negeri,
                    u.name as requester_name, u.email as requester_email
             FROM school_claims sc
             JOIN schools s ON sc.school_id = s.id
             JOIN users u ON sc.user_id = u.id
             WHERE sc.status = ?
             ORDER BY sc.submitted_at DESC
             LIMIT ? OFFSET ?`,
            [status, parseInt(limit), parseInt(offset)]
        );

        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM school_claims WHERE status = ?',
            [status]
        );

        res.json({
            claims,
            total: countResult[0].total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(countResult[0].total / limit)
        });
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ message: 'Failed to fetch claims' });
    }
};

// Approve claim
exports.approveClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const adminId = req.user.id;

        // Get claim details
        const [claimRows] = await pool.execute(
            'SELECT * FROM school_claims WHERE id = ?',
            [claimId]
        );

        if (claimRows.length === 0) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        const claim = claimRows[0];

        // Update claim status
        await pool.execute(
            `UPDATE school_claims 
             SET status = 'APPROVED', reviewed_at = NOW(), reviewed_by = ?
             WHERE id = ?`,
            [adminId, claimId]
        );

        // Update school as claimed
        await pool.execute(
            `UPDATE schools 
             SET status_claim = 'CLAIMED', claimed_by = ?, claimed_at = NOW(), verified_by = ?, verified_at = NOW()
             WHERE id = ?`,
            [claim.user_id, adminId, claim.school_id]
        );

        // Add user as school official
        await pool.execute(
            `INSERT INTO school_officials (school_id, nama, jawatan, email, no_telefon, is_primary_contact, created_by)
             VALUES (?, ?, ?, ?, ?, TRUE, ?)`,
            [claim.school_id, claim.full_name, claim.position, claim.email, claim.phone, claim.user_id]
        );

        res.json({ message: 'Claim approved successfully' });
    } catch (error) {
        console.error('Error approving claim:', error);
        res.status(500).json({ message: 'Failed to approve claim' });
    }
};

// Reject claim
exports.rejectClaim = async (req, res) => {
    try {
        const { claimId } = req.params;
        const { reason } = req.body;
        const adminId = req.user.id;

        await pool.execute(
            `UPDATE school_claims 
             SET status = 'REJECTED', reviewed_at = NOW(), reviewed_by = ?, admin_notes = ?
             WHERE id = ?`,
            [adminId, reason, claimId]
        );

        res.json({ message: 'Claim rejected' });
    } catch (error) {
        console.error('Error rejecting claim:', error);
        res.status(500).json({ message: 'Failed to reject claim' });
    }
};

// ============================================
// IMPORT HISTORY
// ============================================

exports.getImportHistory = async (req, res) => {
    try {
        const [logs] = await pool.execute(
            `SELECT * FROM school_import_logs 
             ORDER BY started_at DESC 
             LIMIT 50`
        );

        res.json({ logs });
    } catch (error) {
        console.error('Error fetching import history:', error);
        res.status(500).json({ message: 'Failed to fetch import history' });
    }
};

// ============================================
// BULK IMPORT SCHOOLS
// ============================================

exports.bulkImportSchools = async (req, res) => {
    const userId = req.user ? req.user.id : null;
    
    console.log('Bulk import started by user:', userId);
    
    try {
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', req.file.originalname, 'Size:', req.file.size);

        const XLSX = require('xlsx');
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Read data from Excel - this specific file has header in row 3
        console.log('Parsing Excel...');
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 'A', range: 2 }); // Start from row 3 (0-indexed: 2)
        
        console.log('Total rows parsed from Excel:', data.length);
        
        if (data.length > 0) {
            console.log('First row:', data[0]);
        }
        
        // Skip header rows and map the data with correct column names based on Excel structure
        const schoolsData = data.filter((row, index) => {
            // Skip first 2 rows (header and info rows) and rows without school data
            return index > 1 && row['F'] && row['G'] && row['F'] !== 'KODSEKOLAH';
        }).map(row => ({
            KODSEKOLAH: row['F'],        // Column F
            NAMASEKOLAH: row['G'],       // Column G
            NEGERI: row['B'],            // Column B (NEGERI)
            PPD: row['C'],               // Column C (PPD)
            PERINGKAT: row['D'],         // Column D (PERINGKAT)
            JENIS: row['E'],             // Column E (JENIS/LABEL)
            ALAMATSURAT: row['H'],       // Column H
            POSKODSURAT: row['I'],       // Column I
            BANDARSURAT: row['J'],       // Column J
            NOTELEFON: row['K'],         // Column K
            NOFAX: row['L'],             // Column L
            EMAIL: row['M'],             // Column M
            LOKASI: row['N'],            // Column N
            BANTUAN: row['O'],           // Column O
            MURID: row['P'],             // Column P
            GURU: row['Q'],              // Column Q
            PRASEKOLAH: row['R'],        // Column R
            INTEGRASI: row['S'],         // Column S
            KOORDINATXX: row['T'],       // Column T
            KOORDINATYY: row['U']        // Column U
        }));
        
        console.log('Valid schools after mapping:', schoolsData.length);
        if (schoolsData.length > 0) {
            console.log('First school:', schoolsData[0]);
        }
        
        const batchId = `BATCH_${Date.now()}`;
        let imported = 0;
        let updated = 0;
        let failed = 0;
        const errors = [];

        // Start import log
        const [logResult] = await pool.execute(
            `INSERT INTO school_import_logs (batch_id, filename, total_records, imported_by, started_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [batchId, req.file.originalname, schoolsData.length, userId]
        );
        const logId = logResult.insertId;

        // Process each school
        for (let i = 0; i < schoolsData.length; i++) {
            const row = schoolsData[i];
            
            try {
                const schoolData = {
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

                // Normalize NEGERI values (Column B already contains state names)
                if (schoolData.negeri) {
                    if (schoolData.negeri === 'WILAYAH PERSEKUTUAN KUALA LUMPUR') {
                        schoolData.negeri = 'Kuala Lumpur';
                    } else if (schoolData.negeri === 'WILAYAH PERSEKUTUAN LABUAN') {
                        schoolData.negeri = 'Labuan';
                    } else if (schoolData.negeri === 'WILAYAH PERSEKUTUAN PUTRAJAYA') {
                        schoolData.negeri = 'Putrajaya';
                    } else if (schoolData.negeri === 'PULAU PINANG') {
                        schoolData.negeri = 'Pulau Pinang';
                    }
                    // For other states, capitalize properly
                    else {
                        schoolData.negeri = schoolData.negeri.charAt(0) + schoolData.negeri.slice(1).toLowerCase();
                    }
                }

                // Normalize PERINGKAT values
                if (schoolData.peringkat) {
                    if (schoolData.peringkat.toLowerCase() === 'rendah') {
                        schoolData.peringkat = 'Rendah';
                    } else if (schoolData.peringkat.toLowerCase() === 'menengah') {
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

                if (existing.length > 0) {
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
                    // Insert new school
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

        // Update import log
        await pool.execute(
            `UPDATE school_import_logs SET
                imported_records = ?, updated_records = ?, failed_records = ?, errors = ?, completed_at = NOW()
             WHERE id = ?`,
            [imported, updated, failed, errors.slice(0, 50).join('\n'), logId]
        );

        console.log(`Import completed: ${imported} imported, ${updated} updated, ${failed} failed`);

        res.json({
            success: true,
            batchId,
            total: schoolsData.length,
            imported,
            updated,
            failed,
            errors: errors.slice(0, 10)
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ message: 'Failed to import schools', error: error.message });
    }
};
