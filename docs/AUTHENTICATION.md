# Authentication System Documentation

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready

---

## Overview

The Mantap.work authentication system implements a secure, token-based authentication flow using JWT (JSON Web Tokens). The system supports multiple user roles with granular permissions and includes session management, automatic token refresh, and comprehensive activity logging.

---

## Architecture

### Authentication Flow

```
┌─────────────┐         Login Request          ┌─────────────┐
│   Client    │ ─────────────────────────────> │   Server    │
│  (Vue.js)   │                                 │  (Node.js)  │
└─────────────┘                                 └─────────────┘
       │                                               │
       │ <─────────────────────────────────────       │
       │         JWT Token + User Data                 │
       │                                               │
       │  ┌─────────────────────────────────────────┐  │
       │  │  Store in:                              │  │
       │  │  - localStorage: token                  │  │
       │  │  - localStorage: user (JSON)           │  │
       │  │  - localStorage: permissions           │  │
       │  │  - localStorage: sessionExpiry         │  │
       │  └─────────────────────────────────────────┘  │
       │                                               │
       │  Subsequent API Requests                      │
       │  Authorization: Bearer <token>                │
       │  ─────────────────────────────────────────>   │
       │                                               │
       │  Automatic Token Refresh (every 5 min)       │
       │  POST /auth/refresh                          │
```

---

## Token Specifications

### JWT Token Structure

**Algorithm:** HS256  
**Secret:** Environment variable `JWT_SECRET`  
**Expiration:** 1 hour (3600 seconds)

**Token Payload:**
```json
{
  "id": 1,
  "role": "admin",
  "iat": 1707340800,
  "exp": 1707344400
}
```

### Token Storage (Client-side)

| Storage Key | Type | Purpose |
|-------------|------|---------|
| `token` | string | JWT access token |
| `user` | JSON | User object (id, email, name, role, status) |
| `permissions` | JSON | Array of permission strings |
| `sessionExpiry` | timestamp | Token expiration time (ms) |

---

## Session Management

### Session Lifecycle

1. **Login** → Token generated, stored in localStorage
2. **Active Use** → Token sent with every API request
3. **Auto Refresh** → Token refreshed every 5 minutes (if close to expiry)
4. **Logout** → Token cleared from localStorage
5. **Expiry** → User redirected to login

### Auto-Refresh Mechanism

```javascript
// Implemented in main.js
setInterval(() => {
  authStore.checkSession()
}, 5 * 60 * 1000) // Every 5 minutes

// In auth store
checkSession() {
  const timeUntilExpiry = sessionExpiry - currentTime
  if (timeUntilExpiry < 10 minutes) {
    refreshToken() // Extend session
  }
}
```

---

## Role Hierarchy

### Role Levels

```
Level 10: super-admin  (Can manage everything)
Level 9:  admin         (Can manage most features)
Level 8:  creator       (Content management)
Level 5:  mentor        (Mentorship features)
Level 5:  tutor         (Tutoring features)
Level 4:  publisher     (Book publishing)
Level 4:  merchant      (Merchant features)
Level 4:  tuition-center (Tuition center mgmt)
Level 3:  parent        (Parent features)
Level 2:  student       (Student features)
Level 1:  user          (Basic access)
```

### Role Permissions

**Super Admin:** All permissions (bypasses all checks)

**Admin:** All permissions except:
- `settings.backup`
- `settings.logs`

**Creator:** Content management (CRUD on content, tutors, mentors, schools, merchants, publishers, books)

**Mentor/Tutor:** View content, view profiles, track progress

**Parent:** View content, manage children, view progress

**Student:** View content, view own progress

**Publisher/Merchant/Tuition Center:** Manage own content/profiles

---

## Middleware

### Authentication Middleware

**File:** `server/middleware/auth.js`

```javascript
// Verifies JWT token
const authenticateToken = async (req, res, next) => {
  1. Extract token from Authorization header
  2. Verify JWT signature
  3. Find user in database
  4. Check user status (not suspended/inactive)
  5. Attach user to request object
  6. Call next()
}
```

### Role Check Middleware

```javascript
// Requires specific role(s)
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return 403 Forbidden
    }
    next()
  }
}
```

### Permission Check Middleware

```javascript
// Requires specific permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (req.user.role === 'super-admin') return next()
    
    const permissions = await User.getPermissions(req.user.role)
    if (!permissions.includes(permission)) {
      return 403 Forbidden
    }
    next()
  }
}
```

---

## Security Features

### Password Security

- **Hashing Algorithm:** BCrypt
- **Salt Rounds:** 10
- **Minimum Length:** 8 characters
- **Storage:** Hashed only (never plain text)

### Token Security

- **Storage:** localStorage (with XSS considerations)
- **Transmission:** HTTPS only (Authorization header)
- **Expiration:** 1 hour
- **Refresh:** Sliding window (refresh extends expiration)

### XSS Protection

- Vue.js auto-escapes HTML
- No token in URL parameters
- HttpOnly cookies not used (localStorage trade-off for SPA)

### CSRF Protection

- Token-based authentication inherently prevents CSRF
- No session cookies used
- Custom headers with requests

---

## Authentication Stores

### Auth Store (Pinia)

**File:** `client/src/stores/auth.js`

**State:**
```javascript
{
  token: null,           // JWT token
  user: null,            // User object
  permissions: [],       // User permissions
  isLoading: false,      // Loading state
  error: null,          // Error message
  sessionExpiry: null   // Expiration timestamp
}
```

**Key Methods:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `refreshToken()` - Extend session
- `checkSession()` - Verify and refresh if needed
- `initializeAuth()` - Restore from localStorage

**Getters:**
- `isAuthenticated` - Check if logged in
- `userRole` - Get current role
- `hasPermission(perm)` - Check specific permission
- `canManageRole(role)` - Check role hierarchy

---

## Dashboard Access Control

### Role-Based Redirects

```javascript
const roleDashboards = {
  'super-admin': '/admin',
  'admin': '/admin',
  'creator': '/admin',
  'tutor': '/dashboard/tutor',
  'mentor': '/dashboard/tutor',
  'student': '/dashboard/student',
  'parent': '/dashboard/parent',
  'publisher': '/admin',
  'merchant': '/admin',
  'tuition-center': '/admin',
  'user': '/'
}
```

### Router Guards

```javascript
router.beforeEach((to, from, next) => {
  // 1. Check if authenticated
  // 2. Check if role allowed for route
  // 3. Redirect to appropriate dashboard if not allowed
  // 4. Redirect authenticated users away from login
})
```

---

## Activity Logging

### Logged Events

- `login` - User login
- `logout` - User logout
- `user_created` - New user created
- `user_updated` - User profile updated
- `user_deleted` - User deleted
- `role_changed` - User role modified
- `status_changed` - User status modified
- `password_changed` - Password updated
- `profile_updated` - Profile information changed

### Log Entry Structure

```json
{
  "user_id": 1,
  "action": "login",
  "entity_type": null,
  "entity_id": null,
  "old_values": null,
  "new_values": null,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2026-02-08T12:00:00Z"
}
```

---

## Error Handling

### Authentication Errors

| Error | HTTP Code | Message |
|-------|-----------|---------|
| Invalid credentials | 400 | Invalid credentials |
| Missing token | 401 | Access token required |
| Expired token | 401 | Token expired |
| Invalid token | 403 | Invalid token |
| Account suspended | 403 | Account suspended |
| Account inactive | 403 | Account inactive |
| Insufficient permissions | 403 | Admin access required |

### Client-Side Error Handling

```javascript
// Auth store handles errors
try {
  await authStore.login(credentials)
} catch (error) {
  // Show snackbar notification
  notificationStore.error(error.message)
}
```

---

## Best Practices

### For Developers

1. **Always use auth middleware** for protected routes
2. **Check permissions** before allowing actions
3. **Log important activities** for audit trail
4. **Validate role hierarchy** before role changes
5. **Use HTTPS** in production
6. **Set strong JWT_SECRET** (min 32 characters)

### For Users

1. **Use strong passwords** (min 8 chars, mixed case, numbers)
2. **Logout on shared devices**
3. **Report suspicious activity**
4. **Keep email verified** for notifications

---

## Future Enhancements

### Planned Features

1. **Two-Factor Authentication (2FA)**
   - TOTP support
   - SMS backup codes
   - QR code setup

2. **OAuth Integration**
   - Google Sign-In
   - Facebook Login
   - Microsoft/Azure AD

3. **Session Management**
   - View active sessions
   - Remote logout
   - Device tracking

4. **Password Policies**
   - Minimum complexity requirements
   - Password expiration
   - History check

5. **Rate Limiting**
   - Login attempt limiting
   - API rate limiting
   - Brute force protection

---

## Testing Authentication

### Test Credentials

**Demo Admin Account:**
- Email: `admin@mantap.work`
- Password: `password` (for development only)

**Creating Super Admin:**
```sql
-- Generate bcrypt hash
-- Node: bcrypt.hashSync('YourPassword', 10)

-- Insert into database
INSERT INTO users (email, password, name, role, status) 
VALUES ('superadmin@mantap.work', '$2a$10$...', 'Super Admin', 'super-admin', 'active');
```

### API Testing

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mantap.work","password":"password"}'

# Use token in subsequent requests
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <token>"
```

---

## Troubleshooting

### Common Issues

**"Token expired" errors:**
- Check system time synchronization
- Verify JWT_SECRET is consistent
- Check token refresh is working

**"Cannot change user role":**
- Verify user has higher role level
- Check role hierarchy in code
- Ensure database has proper columns

**Session not persisting:**
- Check localStorage is enabled
- Verify browser privacy settings
- Check for JavaScript errors

---

*For API endpoints, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)*  
*For user roles, see [USER_MANAGEMENT.md](./USER_MANAGEMENT.md)*
