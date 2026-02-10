# Changelog & Version History

All notable changes to the Mantap.work project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Two-Factor Authentication (2FA)
- OAuth Integration (Google, Facebook)
- Email verification workflow
- Password reset functionality
- API rate limiting
- Real-time notifications (WebSockets)
- Mobile application (React Native/Flutter)

---

## [1.2.0] - 2026-02-10

### School Detail Page & PDF Enhancements

#### ✅ Enhanced
- **School Detail Page Redesign**
  - Removed "Upcoming Events" preview from About-us section
  - Replaced with compelling generic About-us write-up
  - Cleaned up "View all events" button and navigation
  - Improved content structure and readability

- **Professional Single-Page PDF Generation**
  - **Complete Layout Overhaul:** Transformed from multi-page to single A4 page
  - **Vertical Section Flow:** Hero → Highlights → About Us → Events → Contact Information
  - **Compact Design:** Reduced font sizes, margins, and spacing for A4 fit
  - **Print-Optimized Styling:** White backgrounds with clear borders for better printing

- **PDF Visual Improvements**
  - **Statistics Cards:** Changed from teal gradient backgrounds to white background with teal borders
  - **Print-Friendly Colors:** Eliminated solid color blocks that don't print well
  - **Professional Appearance:** Maintained visual appeal while ensuring print clarity
  - **A4 Optimization:** Perfect fit within standard A4 page dimensions (794px × 1123px)

#### 🔧 Technical
- **PDF Layout Restructure**
  - Removed 2-column grid layout in favor of vertical flow
  - Updated CSS to accommodate single-page design
  - Optimized spacing and typography for compact presentation
  - Maintained all existing functionality and data display

- **Code Cleanup**
  - Removed unused `scrollToEvents` function
  - Cleaned up event-related navigation elements
  - Streamlined component structure for better maintainability

#### 📄 PDF Features
- **Hero Section:** School banner with overlay and information
- **Highlights:** Statistics cards (Students, Teachers, Type, Level) with print-friendly styling
- **About Us:** School description with highlights grid
- **Vision & Mission:** Quote and mission text (when available)
- **Events:** Up to 3 upcoming events in compact list format
- **Contact Information:** Complete contact details with icons

#### 🎨 UI/UX Improvements
- **Print-Ready Design:** All elements optimized for clear printing
- **Professional Layout:** Clean vertical flow with proper visual hierarchy
- **Responsive Content:** Adapts to single-page constraints while maintaining readability
- **Enhanced Readability:** Improved text contrast and spacing for print media

---

## [1.1.1] - 2026-02-10

### Bug Fixes & UI Enhancements

#### ✅ Fixed
- **School Directory Negeri Dropdown**
  - Fixed empty Negeri dropdown by changing from `ref()` to `computed()` with `storeToRefs`
  - Implemented reactive binding using Pinia's `storeToRefs` for proper state synchronization
  - Added console logging for debugging filter options loading
  - Negeri dropdown now correctly displays all 16 Malaysian states

#### 🎨 Enhanced
- **Filter UI Improvements**
  - Added active filter count badge (shows "X filters active")
  - Enhanced "Clear All" button with icon and hover effects
  - Improved visual separation between filters and sorting controls
  - Clear filters button appears dynamically only when filters are active

- **Search Bar Redesign**
  - Complete UI/UX overhaul with industry-standard design
  - Seamless integration between input field and search button
  - Added search icon on the left for better visual hierarchy
  - Clear (X) button appears when text is entered
  - Professional shadow and border effects on focus
  - Responsive design with dark mode support

- **Advanced Pagination Controls**
  - Items per page selector: 50, 100, 250, 500 options
  - Comprehensive page navigation: First, Previous, Page Numbers, Next, Last
  - Smart pagination with ellipsis (...) for large page counts
  - Active page highlighting with heritage teal color
  - Results counter showing "Showing X-Y of Z results"
  - Responsive design that works on all screen sizes

- **Header Information Display**
  - Main header always shows total schools count (never changes) - stored in `totalSchoolsAll`
  - Dynamic sub-text shows filtered results count with context
  - Filter context string shows applied filters (e.g., "in PPD Batu Pahat, Johor")
  - "Showing all schools" message when no filters applied
  - Clear separation between static hero text and dynamic filter results
  - Better user feedback on current view state

#### 🔧 Technical
- **Code Quality**
  - Improved reactivity in SchoolDirectory.vue using computed properties
  - Better state management with Pinia storeToRefs pattern
  - Consistent filter behavior between Landing Page and School Directory
  - Added `displayedPages` computed property for smart pagination logic
  - Implemented `itemsPerPage` state with change handler
  - Added `totalSchoolsAll` ref to store unfiltered total count
  - Created `filterContextString` computed property for filter display

- **Cleanup**
  - Removed all console.log statements from SchoolDirectory.vue
  - Removed all console.error statements from schools.js store
  - Cleaned up debug watchers and initialization logs

---

---

## [1.1.0] - 2026-02-09

### School Directory Module - Complete Implementation

#### ✅ Added
- **School Directory System**
  - 10,229 Malaysian schools imported from Ministry of Education
  - Advanced search and filtering by negeri, ppd, bandar, peringkat, jenis
  - School detail pages with full information
  - School claim system for official personnel
  - Bulk import from Excel functionality
  - Admin dashboard for school management
  
- **Filter System**
  - Landing page: Semua Negeri, Semua PPD, Semua Bandar, Semua Jenis
  - School Directory: State, District, City, Type, Level, Status filters
  - PPD-dependent filtering (PPDs based on selected Negeri)
  - City-dependent filtering (Cities based on selected Negeri)
  - Query parameter support for deep linking

- **Profile Settings Module**
  - Avatar upload with preview (5MB limit)
  - Personal information management
  - Password change functionality
  - Dark mode support

#### 🔧 Technical
- **Backend**
  - 7 new database tables (schools, school_claims, school_officials, school_profiles, school_import_logs, states, school_types)
  - 15 API endpoints for school management
  - Excel parsing with xlsx library
  - Bulk import with progress tracking
  
- **Frontend**
  - Rebuilt SchoolDirectory.vue with landing page filter logic
  - Pinia store with reactive filter options (storeToRefs)
  - School cards with pagination
  - Responsive design with dark mode

#### 📁 New Files
```
client/src/views/schools/SchoolDirectory.vue
client/src/views/schools/SchoolDetail.vue
client/src/components/schools/*
client/src/stores/schools.js
server/controllers/schoolController.js
server/routes/schools.js
db/migrations/001_school_directory_schema.sql
scripts/import_schools.py
docs/PRODUCTION_FIX.md
```

---

## 🚨 CRITICAL PRODUCTION FIX (Feb 10, 2026)

### **Issue: MySQL LIMIT/OFFSET Parameter Binding Error**

**Error:**
```
ER_WRONG_ARGUMENTS: Incorrect arguments to mysqld_stmt_execute
sqlMessage: 'Incorrect arguments to mysqld_stmt_execute'
```

**Root Cause:**
MySQL 8.0.45 on Ubuntu - ✅ Fully supports prepared statements

**Actual Issue:** Parameter passing bug in mysql2 library when using spread operator `[...params, ...]` with prepared statements. The params array may be corrupted when reaching execute() function in production environment.

**Environment Details:**
- MySQL: 8.0.45-0ubuntu0.24.04.1 (Ubuntu)
- Node.js: Compatible version
- mysql2: ^3.6.5

**Impact:**
- School directory inaccessible in production
- API returns 500 error when accessing /api/schools
- Landing page and admin dashboard affected

**Solution:**
Modified `server/controllers/schoolController.js` (line 83-92):
- Changed from: `LIMIT ? OFFSET ?` with parameter array
- Changed to: Template literals with parseInt() validation

**Code Fix:**
```javascript
// BEFORE (fails in production):
const [rows] = await pool.execute(
    `... LIMIT ? OFFSET ?`,
    [...params, parseInt(limit), parseInt(offset)]
);

// AFTER (works in all environments):
const safeLimit = parseInt(limit) || 20;
const safeOffset = parseInt(offset) || 0;

const [rows] = await pool.execute(
    `... LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
);
```

**Security:** ✅ parseInt() ensures integer values, preventing SQL injection

**Status:** ✅ FIXED AND TESTED

**Deployment:**
```bash
git add server/controllers/schoolController.js
git commit -m "Fix MySQL LIMIT/OFFSET parameter binding for production"
./deploy.sh prod
pm2 restart mantap-api
```

#### 🗄️ Database Structure

**Master Database File:**
- `db/mantap_work_db_complete.sql` (4.1 MB) - Complete working database with all 10,229 schools

**Migration Files:**
- `db/migrations/001_school_directory_schema.sql` - School directory tables schema
- `db/migrations/002_populate_school_state_and_level.sql` - Data population script

**Total Tables:** 20 tables
- Core: users, user_profiles, permissions, role_permissions, user_activity_logs
- School Module: schools, school_claims, school_officials, school_profiles, school_import_logs, states, school_types
- Content: tutors, mentors, merchants, books, testimonials, tools
- Relations: admins, parent_student_relations

#### 🧹 Database Cleanup
- Consolidated 10+ migration files into clean structure
- Removed redundant/temporary SQL files
- Kept only master DB dump and essential migrations
- Production-ready database organization

---

## [1.0.0] - 2026-02-08

### Added

#### Core Features
- **Multi-Role User Management System**
  - 11 user roles with hierarchical permissions
  - Role-Based Access Control (RBAC)
  - User status management (active, inactive, suspended, pending)
  - User profile management with extended fields

#### Authentication & Security
- **JWT Token Authentication**
  - Secure token-based authentication
  - Automatic token refresh (5-minute intervals)
  - Session management with localStorage
  - Password hashing with BCrypt (10 rounds)
  - Activity logging system
  - Permission-based access control

#### Dashboard System
- **Multi-Dashboard Architecture**
  - Admin Dashboard (super-admin, admin, creator)
  - Tutor Dashboard (tutors, mentors)
  - Student Dashboard
  - Parent Dashboard
  - Role-based automatic redirects

#### User Interface
- **Landing Page**
  - Hero section with animations
  - Tutor network showcase
  - Mentor directory
  - Schools directory
  - Merchants directory
  - Books catalog
  - Free tools section
  - Testimonials
  - Dark/Light mode toggle
  - Language switcher (EN/BM)

- **Admin Interface**
  - Collapsible sidebar navigation
  - Statistics dashboard with charts
  - User management (CRUD operations)
  - Bulk operations (delete, status update)
  - User filtering and search
  - Export to CSV functionality
  - Activity monitoring
  - Quick action shortcuts

#### Notification System
- Global snackbar notifications
- Success, error, warning, info types
- Auto-dismiss with manual close
- Pinia-based state management

#### API Endpoints
- **Authentication**
  - POST /auth/register
  - POST /auth/login
  - POST /auth/logout
  - GET /auth/me
  - PUT /auth/profile
  - POST /auth/change-password
  - POST /auth/refresh

- **User Management**
  - GET /users (paginated, filtered)
  - GET /users/:id
  - POST /users
  - PUT /users/:id
  - PATCH /users/:id/role
  - PATCH /users/:id/status
  - DELETE /users/:id
  - POST /users/bulk-delete
  - POST /users/bulk-status
  - GET /users/stats
  - GET /users/export
  - GET /users/:id/activity

#### Database Schema
- **Core Tables**
  - users (with role/status tracking)
  - user_profiles (extended information)
  - permissions (RBAC system)
  - role_permissions (permission mapping)
  - parent_student_relations
  - user_activity_logs

- **Content Tables**
  - tutors
  - mentors
  - schools
  - merchants
  - books
  - testimonials
  - tools

#### Documentation
- Comprehensive README
- Database schema documentation
- API documentation with examples
- User management guide
- Authentication flow documentation
- Frontend architecture guide
- Deployment guide
- This changelog

### Technical Implementation

#### Backend
- Node.js with Express framework
- MySQL2 for database connectivity
- JWT for authentication
- BCrypt for password hashing
- CORS enabled
- Environment variable configuration
- Backward-compatible database schema
- Graceful error handling

#### Frontend
- Vue 3 with Composition API
- Pinia for state management
- Vue Router for client-side routing
- Tailwind CSS for styling
- Vue I18n for internationalization
- GSAP for animations
- Axios for API communication
- Vite for build tooling

#### Security Features
- JWT token authentication
- Role hierarchy validation
- Permission-based access control
- Password strength requirements
- Session expiration handling
- Activity audit logging
- XSS protection (Vue auto-escaping)
- CSRF protection (token-based)

### Fixed
- Database column compatibility issues
- Login redirect errors for non-admin users
- User role update functionality
- Import path resolution in components

### Security
- Implemented secure password hashing
- Added JWT token expiration
- Created role-based access control
- Added activity logging for audit trails

---

## [0.9.0] - 2026-02-01

### Beta Release
- Initial landing page implementation
- Basic Vue.js setup with routing
- Tailwind CSS integration
- MySQL database schema design

---

## [0.5.0] - 2026-01-15

### Alpha Release
- Project initialization
- Repository setup
- Technology stack selection
- Initial documentation

---

## Documentation

- **Last Updated:** February 10, 2026
- **Current Version:** 1.2.0
- **Next Version:** 1.3.0 (Planned)

See [SESSION_SUMMARY.md](./SESSION_SUMMARY.md) for detailed session progress.
