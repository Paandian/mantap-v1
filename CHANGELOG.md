# Changelog

All notable changes to Mantap.work project.

## [1.2.1] - 2026-02-11

### Enhanced Bulk Import System

#### Added
- **Smart Name Normalization System**
  - Comprehensive negeri (state) name normalizer handling 100+ variations
  - Smart bandar (city/town) name normalizer with prefix handling
  - Automatic correction of common abbreviations (W.P., WP, Bdr, Kg, etc.)
  - Handles all Malaysian states including Wilayah Persekutuan variations
  - City-specific normalization for major towns (KL, PJ, Ipoh, Johor Bahru, etc.)

- **Advanced Import Strategies**
  - **Merge Mode:** Update existing + add new schools (default)
  - **Drop & Import:** Delete all existing schools and import fresh
  - **Backup & Replace:** Create SQL backup, then drop & import
  - Strategy selection UI with clear warnings and descriptions

- **Pre-Import Validation & Preview**
  - Upload and analyze Excel file before actual import
  - Preview data normalization results
  - Show statistics: total schools, normalization success rate, updates needed
  - Sample data preview showing original vs normalized names
  - Warning system for unrecognized state/city names

- **Automatic SQL Backup System**
  - One-click backup creation before destructive operations
  - Downloadable .sql backup files
  - Backup listing and management
  - Full data restoration capability from backups

- **Enhanced Import Controller**
  - Two-step import process: validate → execute
  - Progress tracking and status updates
  - Detailed error logging and reporting
  - Normalization audit trail stored in import logs

#### Technical Implementation
- **New Utilities:**
  - `server/utils/nameNormalizer.js` - Smart name normalization engine
  - `server/utils/backupUtils.js` - SQL backup generation and management
  - `server/controllers/enhancedImportController.js` - Enhanced import endpoints

- **New UI Component:**
  - `EnhancedSchoolImportModal.vue` - 4-step import wizard with validation (✅ Integrated into admin dashboard)

#### Bug Fixes (2026-02-11)
- **Fixed database column error:** Added backwards compatibility for `strategy` and `normalization_log` columns
  - Created migration: `006_add_enhanced_import_columns.sql`
  - Controller now handles both old and new database schemas gracefully
  - Fallback mechanism prevents import failures on existing databases
- **Fixed UI visibility issue:** Reduced modal content size to ensure "Preview & Validate" button is always visible
  - Compact strategy selection cards
  - Reduced padding throughout Step 1
  - Better scroll area calculation

#### Benefits
- **Eliminates manual data cleaning** - Upload any Excel format, system auto-normalizes
- **Prevents data loss** - Backups created automatically before destructive operations
- **Provides visibility** - Preview changes before committing
- **Handles edge cases** - Works with inconsistent Excel files from different sources
- **Production-safe** - Multiple safety checks and confirmation steps

---

## [1.2.0] - 2026-02-11

### ✅ School Directory Module (Production Ready)

#### Added
- **Complete filter system** for Malaysian school directory
  - Landing page: 4 filters (Negeri → PPD/Bandar → Jenis)
  - School directory: 6 filters (full filtering)
  - Mutual exclusion between PPD and Bandar filters
- **Excel bulk import** for 10,232 schools
- **Dynamic state listing** based on database (adapts to changes)

#### Fixed
- **Critical Production Issue:** MySQL LIMIT/OFFSET parameter binding
- **Negeri casing variations:** Negeri Sembilan, Pulau Pinang, W.P. states
- **Filter synchronization:** Landing page → School directory query params
- **Filter clearing bug:** Watchers not clearing on initial load

#### Changed
- Simplified filter architecture (removed PPD-based city grouping)
- Normalized all database negeri names
- Updated landing page filter UI

### Database
- Added migrations for negeri name normalization
- Fixed Excel import column mapping (NEGERI, PPD, PERINGKAT, JENIS)

---

## [1.1.0] - 2026-02-09

### Profile & Settings
- Avatar upload with crop functionality
- Personal information management
- Password change
- Dark mode support

---

## [1.0.0] - 2026-02-08

### Initial Release
- User authentication & authorization
- Dashboard for different user types (Student, Tutor, Parent)
- Basic school directory structure