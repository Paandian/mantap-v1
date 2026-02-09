# School Directory Module

## Overview

The School Directory module provides a comprehensive directory of Malaysian schools (Primary and Secondary) with features for searching, filtering, claiming, and managing school profiles.

**Data Source:** Senarai Sekolah Rendah dan Menengah Jun 2022 (Ministry of Education Malaysia)

**Total Schools:** 10,229 schools across 16 states and territories

---

## Features

### 1. **Public Directory**
- Search schools by name or code
- Filter by state, level (primary/secondary), type
- View school details and statistics
- School location on map (coordinates)

### 2. **School Claim System**
- School personnel can claim their school
- Submit verification documents
- Admin approval workflow
- Authorized badge on claimed schools

### 3. **Admin Management**
- Full CRUD operations
- Bulk import from Excel
- Import history tracking
- Claim request management
- Bulk delete functionality

### 4. **School Mini-Websites**
- Each school has its own public page
- Official badge for claimed schools
- School officials and contact info
- Gallery and achievements

---

## Database Schema

### Tables Created

#### 1. `schools`
Main table containing all school data from the Excel file.

**Key Columns:**
- `kod_sekolah` - Unique school code (e.g., ABA0001)
- `nama_sekolah` - School name
- `negeri` - State
- `peringkat` - Education level (Rendah/Menengah)
- `jenis` - School type (SK, SMK, SJKC, etc.)
- `status_claim` - UNCLAIMED/PENDING/CLAIMED/REJECTED

#### 2. `school_claims`
Tracks school claim requests from users.

#### 3. `school_officials`
Stores officials (headmaster, teachers) for claimed schools.

#### 4. `school_profiles`
Extended profile data for claimed schools (description, vision, mission, etc.).

#### 5. `school_import_logs`
Tracks bulk import operations.

#### 6. `states` & `school_types`
Reference tables for dropdowns.

---

## File Structure

```
db/migrations/
├── 001_school_directory_schema.sql    # Database schema

server/
├── controllers/
│   └── schoolController.js            # API controllers
├── routes/
│   └── schools.js                     # API routes

client/
├── src/
│   ├── stores/
│   │   └── schools.js                 # Pinia store
│   └── components/schools/
│       ├── SchoolDirectoryAdmin.vue   # Admin interface
│       ├── SchoolFormModal.vue        # Create/Edit form
│       ├── SchoolImportModal.vue      # Bulk import UI
│       └── SchoolPublicView.vue       # Public directory

scripts/
├── analyze_excel.py                   # Excel analysis tool
└── import_schools.py                  # Data import script

docs/school-directory/
├── README.md                          # This file
├── DATABASE_SCHEMA.md                 # Detailed schema docs
├── API_DOCUMENTATION.md               # API endpoints
└── data_analysis.json                 # Excel structure analysis
```

---

## Installation

### Step 1: Run Database Migration

```bash
# On your server
cd /var/www/html/mantap-v1/db/migrations
mysql -u root -p mantap_work_db < 001_school_directory_schema.sql
```

### Step 2: Import School Data

```bash
# Install Python dependencies
pip install pandas mysql-connector-python openpyxl

# Set environment variables
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=mantap_work_db

# Run import script
cd /var/www/html/mantap-v1
python scripts/import_schools.py
```

**Expected Output:**
```
Reading Excel file: docs/resources/Senarai Sekolah Rendah dan Menengah Jun 2022.xlsx
Total schools to import: 10229
Importing schools...
  Progress: 1000 schools processed...
  Progress: 2000 schools processed...
  ...
============================================================
Import Complete!
============================================================
Batch ID: BATCH_20260209_143022
Total schools: 10229
New imports: 10229
Updated: 0
Failed: 0
```

### Step 3: Verify Installation

```bash
# Check schools in database
mysql -u root -p mantap_work_db -e "SELECT COUNT(*) as total_schools FROM schools;"

# Expected: 10229
```

---

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools` | List all schools with filters |
| GET | `/api/schools/:id` | Get single school details |
| GET | `/api/schools/filters/options` | Get filter dropdown options |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/schools/:id/claim` | Submit school claim |
| GET | `/api/schools/my/claims` | Get user's claims |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/schools` | Create school |
| PUT | `/api/schools/:id` | Update school |
| DELETE | `/api/schools/:id` | Delete school |
| POST | `/api/schools/bulk-delete` | Bulk delete |
| GET | `/api/schools/admin/claims` | Get claim requests |
| POST | `/api/schools/admin/claims/:id/approve` | Approve claim |
| POST | `/api/schools/admin/claims/:id/reject` | Reject claim |
| GET | `/api/schools/admin/import-history` | Import logs |

---

## Usage Guide

### For Administrators

#### Adding a Single School

1. Navigate to Admin Dashboard → School Directory
2. Click "Add School" button
3. Fill in the form:
   - School Code (Kod Sekolah)
   - School Name
   - State, PPD, Level, Type
   - Address and Contact Info
   - Statistics (students, teachers)
4. Click Save

#### Bulk Import

1. Prepare Excel file with columns matching the template
2. Click "Bulk Import" button
3. Upload Excel file
4. Review import summary
5. Errors will be logged in `school_import_logs` table

#### Managing Claims

1. Navigate to Claims tab
2. View pending claim requests
3. Review submitted information
4. Click Approve or Reject
5. Add notes for rejected claims

### For School Personnel

#### Claiming a School

1. Register/Login to mantap.work
2. Search for your school in the directory
3. Click "Claim This School"
4. Fill in the claim form:
   - Full Name
   - Position (Headmaster, Teacher, etc.)
   - Email and Phone
   - Upload verification document (Staff ID, etc.)
5. Submit for approval
6. Wait for admin approval (usually 1-2 business days)

#### Managing Claimed School

Once approved:
1. Access your school page
2. Click "Edit Profile" (only visible to authorized personnel)
3. Update:
   - School description and history
   - Vision, Mission, Motto
   - Facilities and achievements
   - Upload photos to gallery
   - Add school officials
   - Update contact information

---

## School Types Reference

### Primary Schools (Rendah)

| Code | Full Name | Description |
|------|-----------|-------------|
| SK | Sekolah Kebangsaan | National primary school |
| SK KHAS | Sekolah Kebangsaan Khas | Special needs primary |
| SJKC | Sekolah Jenis Kebangsaan (Cina) | Chinese primary school |
| SJKT | Sekolah Jenis Kebangsaan (Tamil) | Tamil primary school |
| SR SABK | Sekolah Rendah Agama Bantuan Kerajaan | Government-aided religious |

### Secondary Schools (Menengah)

| Code | Full Name | Description |
|------|-----------|-------------|
| SMK | Sekolah Menengah Kebangsaan | National secondary school |
| SMKA | Sekolah Menengah Kebangsaan Agama | Religious secondary |
| SBP | Sekolah Berasrama Penuh | Fully residential school |
| KV | Kolej Vokasional | Vocational college |
| SMT | Sekolah Menengah Teknik | Technical secondary |

---

## States and Territories

The system includes all 16 states and federal territories:

1. Johor (JHR)
2. Kedah (KDH)
3. Kelantan (KEL)
4. Melaka (MLK)
5. Negeri Sembilan (NSN)
6. Pahang (PHG)
7. Perak (PRK)
8. Perlis (PLS)
9. Pulau Pinang (PNG)
10. Sabah (SBH)
11. Sarawak (SRW)
12. Selangor (SGR)
13. Terengganu (TRG)
14. Wilayah Persekutuan Kuala Lumpur (WPKL)
15. Wilayah Persekutuan Labuan (WPL)
16. Wilayah Persekutuan Putrajaya (WPJ)

---

## Claim Verification Process

### Requirements for Claim Approval

1. **Position Verification**
   - Headmaster/Principal
   - Senior Assistant
   - Administrative staff
   - Teacher with authorization letter

2. **Required Documents**
   - Staff ID card, OR
   - Appointment letter, OR
   - Authorization letter from headmaster

3. **Contact Verification**
   - Email must match school domain (preferred)
   - Phone number must be school official number

### Approval Workflow

```
User Submits Claim
       ↓
   PENDING
       ↓
Admin Reviews (1-2 days)
       ↓
   ┌───────┴───────┐
   ↓               ↓
APPROVED      REJECTED
   ↓               ↓
User becomes   User notified
school admin   with reason
```

---

## Maintenance

### Updating School Data

When the Ministry releases updated school lists:

1. Download new Excel file
2. Backup current database:
   ```bash
   mysqldump -u root -p mantap_work_db schools > schools_backup_$(date +%Y%m%d).sql
   ```
3. Run import script with new file:
   ```bash
   python scripts/import_schools.py /path/to/new_schools.xlsx
   ```
4. Script will:
   - Insert new schools
   - Update existing schools (if data changed)
   - Log all changes in `school_import_logs`

### Monitoring

Check import history:
```sql
SELECT * FROM school_import_logs ORDER BY started_at DESC LIMIT 10;
```

View claimed schools:
```sql
SELECT kod_sekolah, nama_sekolah, negeri, claimed_at 
FROM schools 
WHERE status_claim = 'CLAIMED' 
ORDER BY claimed_at DESC;
```

---

## Troubleshooting

### Import Script Errors

**Error: "ModuleNotFoundError: No module named 'pandas'"**
```bash
pip install pandas openpyxl mysql-connector-python
```

**Error: "Access denied for user"**
- Check database credentials in environment variables
- Verify MySQL user has INSERT/UPDATE permissions

**Error: "Duplicate entry for key 'kod_sekolah'"**
- This is normal - script will update instead of insert
- Check `updated` count in output

### API Errors

**500 Error on /api/schools**
- Check database connection
- Verify `schools` table exists: `SHOW TABLES LIKE 'schools';`
- Check server logs: `pm2 logs mantap-api`

**CORS Errors**
- Ensure client built with production env
- Check `VITE_API_BASE=/api` in client/.env.production

---

## Future Enhancements

### Planned Features

1. **Map Integration**
   - Interactive map with school locations
   - Cluster markers for dense areas
   - Route planning to schools

2. **Reviews & Ratings**
   - Parents/students can rate schools
   - Review moderation system

3. **Comparison Tool**
   - Compare multiple schools side-by-side
   - Export comparison PDF

4. **Advanced Analytics**
   - School enrollment trends
   - Geographic distribution charts
   - Performance metrics (if available)

5. **Mobile App**
   - Find nearest schools
   - Save favorite schools
   - Get directions

---

## Support

For technical support or questions about the School Directory module:

1. Check this documentation
2. Review API logs: `pm2 logs mantap-api`
3. Check database: `SELECT * FROM school_import_logs ORDER BY id DESC LIMIT 5;`
4. Contact mantap.work support team

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Data Version:** Jun 2022 (Ministry of Education Malaysia)
