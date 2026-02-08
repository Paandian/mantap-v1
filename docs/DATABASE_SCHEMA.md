# Database Schema Documentation

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Database:** MySQL 8.0+

---

## Table of Contents

1. [Core Tables](#core-tables)
2. [User Management Tables](#user-management-tables)
3. [Content Tables](#content-tables)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Migration History](#migration-history)

---

## Core Tables

### 1. users
Primary user authentication table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| name | VARCHAR(255) | | Full name |
| role | ENUM | DEFAULT 'user' | User role (see roles below) |
| status | ENUM | DEFAULT 'active' | Account status |
| avatar_url | VARCHAR(500) | NULL | Profile picture URL |
| phone | VARCHAR(20) | NULL | Phone number |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| email_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| phone_verified | BOOLEAN | DEFAULT FALSE | Phone verification status |
| created_by | INT | NULL, FK | User who created this account |
| notes | TEXT | NULL | Admin notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Roles ENUM:**
- `super-admin` - Full system access
- `admin` - System management
- `creator` - Content management
- `mentor` - Mentorship features
- `tutor` - Tutoring features
- `parent` - Parent features
- `student` - Student features
- `publisher` - Book publishing
- `merchant` - Merchant features
- `tuition-center` - Tuition center management
- `user` - Basic user

**Status ENUM:**
- `active` - Fully functional account
- `inactive` - Deactivated account
- `suspended` - Suspended by admin
- `pending` - Awaiting approval

---

## User Management Tables

### 2. user_profiles
Extended user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Profile ID |
| user_id | INT | UNIQUE, NOT NULL, FK → users.id | Linked user |
| bio | TEXT | NULL | User biography |
| address | TEXT | NULL | Street address |
| city | VARCHAR(100) | NULL | City |
| state | VARCHAR(100) | NULL | State/Province |
| country | VARCHAR(100) | DEFAULT 'Malaysia' | Country |
| postal_code | VARCHAR(20) | NULL | ZIP/Postal code |
| date_of_birth | DATE | NULL | Birth date |
| gender | ENUM | NULL | Gender preference |
| education_level | VARCHAR(100) | NULL | Highest education |
| occupation | VARCHAR(100) | NULL | Job title |
| website | VARCHAR(255) | NULL | Personal website |
| social_links | JSON | NULL | Social media links |

**Gender ENUM:**
- `male`
- `female`
- `other`
- `prefer_not_to_say`

### 3. permissions
System permissions registry.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Permission ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Permission identifier (e.g., 'users.create') |
| description | TEXT | NULL | Human-readable description |
| module | VARCHAR(50) | NOT NULL | Module name (e.g., 'users', 'content') |
| action | VARCHAR(50) | NOT NULL | Action type (create, read, update, delete, manage) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 4. role_permissions
Role-to-permission mapping.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Mapping ID |
| role | ENUM | NOT NULL | User role |
| permission_id | INT | NOT NULL, FK → permissions.id | Permission reference |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**UNIQUE KEY:** (role, permission_id)

### 5. parent_student_relations
Parent-student relationship tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Relation ID |
| parent_id | INT | NOT NULL, FK → users.id | Parent user |
| student_id | INT | NOT NULL, FK → users.id | Student user |
| relationship_type | ENUM | DEFAULT 'guardian' | Type of relationship |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary contact flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Relationship Types:**
- `father`
- `mother`
- `guardian`
- `other`

### 6. user_activity_logs
Audit trail for user actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Log ID |
| user_id | INT | NOT NULL, FK → users.id | Acting user |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NULL | Affected entity type |
| entity_id | INT | NULL | Affected entity ID |
| old_values | JSON | NULL | Previous values |
| new_values | JSON | NULL | New values |
| ip_address | VARCHAR(45) | NULL | User IP address |
| user_agent | TEXT | NULL | Browser user agent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

---

## Content Tables

### 7. tutors
Tutor profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Tutor ID |
| name | VARCHAR(255) | NOT NULL | Tutor name |
| bio | TEXT | NULL | Tutor biography |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | Average rating (0-5) |
| image_url | VARCHAR(500) | NULL | Profile image |
| verification_status | ENUM | DEFAULT 'Unverified' | Verification state |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Verification ENUM:**
- `Verified`
- `Unverified`

### 8. mentors
Mentor profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Mentor ID |
| name | VARCHAR(255) | NOT NULL | Mentor name |
| bio | TEXT | NULL | Mentor biography |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | Average rating |
| image_url | VARCHAR(500) | NULL | Profile image |
| specialty | VARCHAR(255) | NULL | Area of expertise |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 9. schools
School directory entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | School ID |
| name | VARCHAR(255) | NOT NULL | School name |
| location | VARCHAR(255) | NULL | School location |
| claimed_status | ENUM | DEFAULT 'UNCLAIMED' | Claim status |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | School rating |
| image_url | VARCHAR(500) | NULL | School image |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 10. merchants
Educational merchant listings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Merchant ID |
| name | VARCHAR(255) | NOT NULL | Merchant name |
| description | TEXT | NULL | Merchant description |
| verified_status | ENUM | DEFAULT 'UNVERIFIED' | Verification status |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | Merchant rating |
| price | DECIMAL(10,2) | NULL | Product/service price |
| image_url | VARCHAR(500) | NULL | Merchant image |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 11. books
Educational book catalog.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Book ID |
| title | VARCHAR(255) | NOT NULL | Book title |
| publisher | VARCHAR(255) | NULL | Publisher name |
| verified_status | ENUM | DEFAULT 'UNVERIFIED' | Verification status |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | Book rating |
| description | TEXT | NULL | Book description |
| price | DECIMAL(10,2) | NULL | Book price |
| image_url | VARCHAR(500) | NULL | Book cover image |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 12. testimonials
User testimonials.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Testimonial ID |
| name | VARCHAR(255) | NOT NULL | Author name |
| role | VARCHAR(255) | NULL | Author role |
| content | TEXT | NULL | Testimonial text |
| image_url | VARCHAR(500) | NULL | Author image |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

### 13. tools
Free educational tools/micro-apps.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Tool ID |
| name | VARCHAR(255) | NOT NULL | Tool name |
| description | TEXT | NULL | Tool description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

---

## Relationships

### Foreign Key Relationships

```
users.created_by → users.id (ON DELETE SET NULL)
user_profiles.user_id → users.id (ON DELETE CASCADE)
role_permissions.permission_id → permissions.id (ON DELETE CASCADE)
parent_student_relations.parent_id → users.id (ON DELETE CASCADE)
parent_student_relations.student_id → users.id (ON DELETE CASCADE)
user_activity_logs.user_id → users.id (ON DELETE CASCADE)
```

### Entity Relationship Diagram (Simplified)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│    users    │─────│  user_profiles   │     │ permissions │
└─────────────┘     └──────────────────┘     └─────────────┘
       │                                               │
       │         ┌──────────────────┐                  │
       └─────────│ role_permissions │──────────────────┘
                 └──────────────────┘
       │
       ├─────────────────┐
       │                 │
┌──────────────────┐  ┌──────────────────┐
│parent_student_   │  │user_activity_logs│
│   relations      │  └──────────────────┘
└──────────────────┘

┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  tutors │  │ mentors  │  │  schools │  │ merchants│  │  books   │
└─────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘

┌─────────────┐  ┌─────────┐
│testimonials │  │  tools  │
└─────────────┘  └─────────┘
```

---

## Indexes

### Performance Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Activity logs
CREATE INDEX idx_user_activity_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_user_activity_action ON user_activity_logs(action);

-- Role permissions
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
```

---

## Migration History

### Migration 1: Initial Schema (mantap_work_db.sql)
**Date:** February 2026  
**Description:** Initial database setup with basic user, tutor, mentor, school, merchant, book, testimonial, and tool tables.

### Migration 2: User Management Enhancement (user_management_migration.sql)
**Date:** February 2026  
**Description:** 
- Added user status tracking
- Created permissions system
- Added user profiles table
- Created parent-student relationship table
- Added activity logging
- Extended user table with additional fields

### Migration 3: Quick Fix (quick_fix.sql)
**Date:** February 2026  
**Description:** 
- Added missing columns to users table for backward compatibility
- Created user_profiles table if not exists
- Populated profiles for existing users

---

## Data Retention Policies

### user_activity_logs
- **Retention Period:** 90 days
- **Archive Strategy:** Move to archive table after 90 days
- **Purge Strategy:** Delete after 1 year

### users (soft delete consideration)
- Currently uses hard delete
- Consider implementing soft delete for audit purposes

---

## Backup Recommendations

### Daily Backups
- users table
- user_profiles table
- role_permissions table

### Weekly Backups
- Full database dump

### Before Migrations
- Always create full backup before running migrations

---

## Future Schema Considerations

### Planned Tables
1. **sessions** - For session management
2. **notifications** - User notification queue
3. **messages** - User-to-user messaging
4. **appointments** - Tutor-student scheduling
5. **payments** - Transaction records
6. **reviews** - Detailed rating system

### Planned Columns
1. **users.two_factor_enabled** - For 2FA
2. **users.preferences** - JSON user preferences
3. **schools.website** - School website URL
4. **tutors.hourly_rate** - Tutor pricing

---

*For API endpoint documentation, see API_DOCUMENTATION.md*  
*For user role details, see USER_MANAGEMENT.md*
