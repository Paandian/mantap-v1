# API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**Last Updated:** February 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Response Format](#response-format)
4. [Error Codes](#error-codes)
5. [Rate Limiting](#rate-limiting)

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "role": "user"  // Optional: defaults to 'user'
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "status": "active"
  },
  "permissions": []
}
```

**Errors:**
- `400` - Missing required fields
- `400` - Email already registered
- `400` - Invalid role specified

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "status": "active",
    "avatar_url": null
  },
  "permissions": ["content.view", "tutors.view"]
}
```

**Errors:**
- `400` - Missing email or password
- `400` - Invalid credentials
- `403` - Account suspended/inactive/pending

---

### POST /auth/logout
Invalidate current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me
Get current authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "status": "active",
    "avatar_url": null,
    "phone": null,
    "bio": null
  },
  "permissions": ["content.view", "tutors.view"]
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Token expired/invalid

---

### PUT /auth/profile
Update current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+60123456789",
  "bio": "Software developer",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Updated",
    "role": "user",
    "phone": "+60123456789",
    "bio": "Software developer",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

---

### POST /auth/change-password
Change current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400` - Current password incorrect
- `400` - New password too short

---

### POST /auth/refresh
Refresh JWT token before expiration.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Users

User management endpoints (requires admin/creator/super-admin role).

### GET /users
Get paginated list of users with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |
| role | string | Filter by role |
| status | string | Filter by status |
| search | string | Search by name/email |
| dateFrom | date | Filter from date |
| dateTo | date | Filter to date |
| sortBy | string | Sort column (default: created_at) |
| sortOrder | string | ASC or DESC (default: DESC) |

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "active",
      "avatar_url": null,
      "last_login": "2026-02-08T12:00:00Z",
      "email_verified": false,
      "created_at": "2026-02-01T10:00:00Z",
      "updated_at": "2026-02-08T12:00:00Z"
    }
  ],
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

**Required Roles:** `super-admin`, `admin`, `creator`

---

### GET /users/:id
Get single user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "status": "active",
    "avatar_url": null,
    "phone": null,
    "last_login": "2026-02-08T12:00:00Z",
    "email_verified": false,
    "phone_verified": false,
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-08T12:00:00Z",
    "bio": null,
    "city": null,
    "state": null,
    "country": "Malaysia"
  }
}
```

**Errors:**
- `404` - User not found
- `403` - Access denied (can only view own profile unless admin)

---

### POST /users
Create a new user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "name": "New User",
  "role": "tutor",
  "phone": "+60123456789"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "New User",
    "role": "tutor",
    "status": "active"
  }
}
```

**Required Roles:** `super-admin`, `admin`, `creator`

**Errors:**
- `400` - Email already exists
- `403` - Cannot create user with higher role

---

### PUT /users/:id
Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+60987654321",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "status": "active",
  "role": "mentor"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "updated@example.com",
    "name": "Updated Name",
    "role": "mentor",
    "status": "active"
  }
}
```

**Required Roles:** Self or `super-admin`, `admin`, `creator`

**Notes:**
- Only `super-admin` and `admin` can change roles
- Only `super-admin` and `admin` can change status
- Users can only update their own basic info

---

### PATCH /users/:id/role
Update user role only.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": 1,
    "role": "admin"
  }
}
```

**Required Roles:** `super-admin`, `admin`

---

### PATCH /users/:id/status
Update user status only.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Response (200 OK):**
```json
{
  "message": "User status updated successfully",
  "user": {
    "id": 1,
    "status": "suspended"
  }
}
```

**Required Roles:** `super-admin`, `admin`

---

### DELETE /users/:id
Delete a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Required Roles:** `super-admin`, `admin` (can only delete lower roles)

**Errors:**
- `400` - Cannot delete own account
- `403` - Cannot delete user with higher/equal role

---

### POST /users/bulk-delete
Delete multiple users at once.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userIds": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "message": "2 users deleted successfully",
  "deletedCount": 2
}
```

**Required Roles:** `super-admin`, `admin`

---

### POST /users/bulk-status
Update status for multiple users.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userIds": [1, 2, 3],
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "message": "3 users updated successfully",
  "updatedCount": 3
}
```

**Required Roles:** `super-admin`, `admin`

---

### GET /users/stats
Get user statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "byRole": [
    { "role": "admin", "count": 2 },
    { "role": "tutor", "count": 15 },
    { "role": "student", "count": 150 }
  ],
  "byStatus": [
    { "status": "active", "count": 165 },
    { "status": "pending", "count": 2 }
  ],
  "overview": {
    "total_users": 167,
    "new_this_week": 12,
    "new_this_month": 45,
    "active_this_week": 89
  }
}
```

**Required Roles:** `super-admin`, `admin`, `creator`

---

### GET /users/export
Export users to CSV.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | 'csv' (default) |
| role | string | Filter by role |
| status | string | Filter by status |

**Response:** CSV file download

**Required Roles:** `super-admin`, `admin`

---

### GET /users/:id/activity
Get user activity logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20) |

**Response (200 OK):**
```json
{
  "activities": [
    {
      "id": 1,
      "action": "login",
      "entity_type": null,
      "entity_id": null,
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2026-02-08T12:00:00Z"
    }
  ],
  "total": 50,
  "currentPage": 1,
  "totalPages": 3
}
```

---

## Response Format

### Success Response
All successful responses follow this structure:

```json
{
  "message": "Human-readable success message",
  "data": { ... },  // Optional: response data
  "meta": { ... }   // Optional: pagination, etc.
}
```

### Error Response
All error responses follow this structure:

```json
{
  "message": "Human-readable error message"
}
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Current implementation does not include rate limiting. Planned for future versions:

### Proposed Limits
- **Authentication:** 5 attempts per minute
- **API General:** 100 requests per minute per user
- **Bulk Operations:** 10 requests per minute

---

## Authentication Flow

```
┌──────────┐     POST /auth/login      ┌──────────┐
│  Client  │ ────────────────────────> │  Server  │
└──────────┘                           └──────────┘
     │                                      │
     │ <─────────────────────────────      │
     │      JWT Token + User Data           │
     │                                      │
     │  [Store token in localStorage]       │
     │                                      │
     │  Send token in Authorization header  │
     │  for subsequent requests             │
```

---

## Permission System

Permissions follow the format: `{module}.{action}`

### Examples
- `users.view` - View user list
- `users.create` - Create new users
- `users.manage` - Full user management
- `content.publish` - Publish content

See [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) for complete permission matrix.

---

*For authentication details, see [AUTHENTICATION.md](./AUTHENTICATION.md)*  
*For database schema, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)*
