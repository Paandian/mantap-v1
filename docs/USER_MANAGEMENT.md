# User Management System Documentation

## Overview

This document describes the comprehensive user management system implemented for mantap.work, featuring role-based access control (RBAC), session management with Pinia, and a hierarchical permission system.

## Role Hierarchy

The system implements a 10-level role hierarchy:

| Level | Role | Description |
|-------|------|-------------|
| 10 | `super-admin` | Full system access, can manage everything including other admins |
| 9 | `admin` | Can manage most system features, cannot manage super-admins |
| 8 | `creator` | Content management, CRUD operations on app data |
| 5 | `mentor` | Can view content, track progress, limited management |
| 5 | `tutor` | Similar to mentor, focused on tutoring features |
| 4 | `publisher` | Can manage books and content related to publishing |
| 4 | `merchant` | Can manage merchant profile and products |
| 4 | `tuition-center` | Can manage tuition center and associated tutors |
| 3 | `parent` | Can view content, manage children/students |
| 2 | `student` | Basic view permissions, track own progress |
| 1 | `user` | Basic platform access, view-only for most content |

## Features Implemented

### 1. 404 Not Found Page
- **Location**: `/client/src/views/NotFoundView.vue`
- Features animated 404 display, helpful links, and navigation options
- Automatically catches all unmatched routes

### 2. Enhanced Authentication Store (Pinia)
- **Location**: `/client/src/stores/auth.js`
- Session management with automatic token refresh
- Role-based permission checking
- Session expiration handling (1 hour default)
- Activity logging

**Key Getters:**
- `isAuthenticated` - Check if user is logged in
- `userRole` - Current user's role
- `userRoleLevel` - Numeric level for hierarchy comparison
- `isSuperAdmin`, `isAdmin`, etc. - Role checks
- `hasPermission(permission)` - Check specific permission
- `canManageRole(targetRole)` - Check if user can manage a role

**Key Actions:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `fetchCurrentUser()` - Refresh user data
- `updateProfile(data)` - Update user profile
- `refreshToken()` - Extend session
- `initializeAuth()` - Restore session from localStorage

### 3. User Management Store (Pinia)
- **Location**: `/client/src/stores/users.js`
- Complete CRUD operations for users
- Bulk operations (delete, status update)
- Filtering and pagination
- Export functionality

### 4. Database Schema Updates
- **Migration File**: `/db/user_management_migration.sql`

**New Tables:**
- `permissions` - All system permissions
- `role_permissions` - Role-permission mappings
- `user_profiles` - Extended user information
- `parent_student_relations` - Parent-student relationships
- `user_activity_logs` - Activity tracking

**Updated Tables:**
- `users` - Added status, avatar, phone, verification fields

### 5. Backend API Endpoints

#### Authentication Routes (`/api/auth`)
```
POST   /auth/register        - Register new user
POST   /auth/login           - Login user
POST   /auth/logout          - Logout user (protected)
GET    /auth/me              - Get current user (protected)
PUT    /auth/profile         - Update profile (protected)
POST   /auth/change-password - Change password (protected)
POST   /auth/refresh         - Refresh token (protected)
```

#### User Routes (`/api/users`)
```
GET    /users                - List users (admin/creator only)
GET    /users/stats          - User statistics (admin/creator only)
GET    /users/export         - Export users (admin only)
GET    /users/:id            - Get user by ID
GET    /users/:id/activity   - Get user activity logs
POST   /users                - Create user (admin/creator only)
POST   /users/bulk-delete    - Bulk delete (admin only)
POST   /users/bulk-status    - Bulk status update (admin only)
PUT    /users/:id            - Update user
PATCH  /users/:id/role       - Update role (admin only)
PATCH  /users/:id/status     - Update status (admin only)
DELETE /users/:id            - Delete user
```

### 6. Enhanced Admin Dashboard
- **Location**: `/client/src/views/AdminDashboardView.vue`
- Sidebar navigation with role-based tabs
- User management interface
- Statistics dashboard
- Quick actions
- Recent activity feed

**Components:**
- `AdminSidebar.vue` - Collapsible navigation
- `AdminHeader.vue` - Header with user menu
- `DashboardStats.vue` - Statistics cards and charts
- `UserManagement.vue` - User CRUD interface
- `UserTable.vue` - Data table with selection
- `UserModal.vue` - Create/Edit user form
- `UserFilters.vue` - Search and filter controls
- `QuickActions.vue` - Shortcut actions
- `RecentActivity.vue` - Activity feed

## Setup Instructions

### 1. Database Migration

Run the migration SQL file to set up the user management schema:

```bash
mysql -u root -p mantap_work_db < db/user_management_migration.sql
```

### 2. Environment Variables

Ensure your `/server/.env` file has:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=mantap_work_db
JWT_SECRET=your_secure_random_string
PORT=5000
```

### 3. Install Dependencies

**Server:**
```bash
cd server
npm install
npm start
```

**Client:**
```bash
cd client
npm install
npm run dev
```

### 4. Create Super Admin

The migration includes a default super admin. Update the password hash or create one via API:

```bash
# Generate bcrypt hash for password
cd server
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword123', 10));"

# Update in database
mysql -u root -p mantap_work_db
UPDATE users SET password = 'YOUR_HASH_HERE' WHERE email = 'superadmin@mantap.work';
```

## Permission System

### Permission Structure
Permissions follow the format: `{module}.{action}`

**Examples:**
- `users.view` - View users list
- `users.create` - Create new users
- `users.manage` - Full user management
- `content.publish` - Publish content
- `tutors.verify` - Verify tutor credentials

### Default Permissions by Role

**Super Admin:** All permissions

**Admin:** All except backup and logs management

**Creator:** Content management, CRUD on tutors, mentors, schools, merchants, publishers, books

**Mentor/Tutor:** View content, view profiles, track progress

**Parent:** View content, manage children, view progress

**Student:** View content, view own progress

**Publisher:** Manage own books and content

**Merchant:** Manage own profile and products

**Tuition Center:** Manage center and associated tutors

## Security Features

1. **JWT Token Authentication** - Secure token-based auth with expiration
2. **Role Hierarchy** - Users can only manage roles below their level
3. **Permission Checks** - Granular permission system
4. **Activity Logging** - All actions logged with IP and user agent
5. **Status Management** - Users can be active, inactive, suspended, or pending
6. **Session Management** - Automatic token refresh and session validation
7. **Password Hashing** - BCrypt with salt rounds 10

## Usage Examples

### Check Permission in Component
```vue
<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Check if user has specific permission
if (authStore.hasPermission('users.create')) {
  // Show create button
}

// Check role
if (authStore.isAdmin) {
  // Show admin features
}
</script>
```

### Protect Route in Router
```javascript
{
  path: '/admin/users',
  component: UserManagement,
  meta: { 
    requiresAuth: true,
    requiresRole: ['super-admin', 'admin', 'creator']
  }
}
```

### Backend Permission Check
```javascript
const { requireRole, requirePermission } = require('../middleware/auth');

// Require specific role
router.get('/users', requireRole(['super-admin', 'admin']), getUsers);

// Require specific permission
router.post('/users', requirePermission('users.create'), createUser);
```

## API Response Format

### Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@mantap.work",
    "name": "Admin User",
    "role": "admin",
    "status": "active"
  },
  "permissions": ["users.view", "users.create", "users.update"]
}
```

### Error Response
```json
{
  "message": "Invalid credentials"
}
```

## Future Enhancements

1. Two-factor authentication (2FA)
2. OAuth integration (Google, Facebook)
3. Email verification workflow
4. Password reset functionality
5. API rate limiting
6. Advanced analytics dashboard
7. Role customization interface
8. Permission inheritance system

## Troubleshooting

### Common Issues

**1. Token Expired Errors**
- The system automatically refreshes tokens
- If persistent, check JWT_SECRET consistency

**2. Permission Denied**
- Verify user role in database
- Check role_permissions table mappings

**3. Session Not Persisting**
- Ensure localStorage is available
- Check for browser privacy settings blocking storage

**4. Database Connection Errors**
- Verify .env configuration
- Ensure MySQL is running
- Check database and tables exist

## Support

For issues or questions about the user management system:
1. Check the logs in `user_activity_logs` table
2. Verify role and permission configurations
3. Review the database migration was applied correctly
