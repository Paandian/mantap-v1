# Changelog

All notable changes to Mantap.work project.

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