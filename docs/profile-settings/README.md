# Profile Settings Module

**Module:** User Profile Management  
**Status:** ✅ Complete  
**Date:** February 9, 2026  
**Version:** 1.0.0

---

## Overview

The Profile Settings module allows users to manage their personal information, upload profile pictures, and change passwords. This is a self-service feature available to all authenticated users regardless of their role.

---

## ✅ Completed Features

### 1. Backend API

**Files:**
- `server/middleware/upload.js` - Multer configuration for file uploads
- `server/controllers/userController.js` - Profile management endpoints
- `server/routes/users.js` - Route definitions

**API Endpoints:**
```
GET    /api/users/me/profile     - Get current user profile
PUT    /api/users/me/profile     - Update profile information
POST   /api/users/me/avatar      - Upload profile picture
```

**Features:**
- ✅ Avatar upload with 5MB limit
- ✅ Supported formats: JPEG, PNG, WebP
- ✅ Automatic filename generation (userId-timestamp.ext)
- ✅ Profile information update (name, email, phone, bio, location)
- ✅ Password change functionality
- ✅ Activity logging for all profile changes

### 2. Frontend Components

**Files:**
- `client/src/views/ProfileSettingsView.vue` - Main profile settings page

**Features:**
- ✅ Avatar upload with preview
- ✅ Personal information form:
  - Full Name
  - Email Address
  - Phone Number
  - City
  - State/Province
  - Country
  - Bio (500 character limit)
- ✅ Change password section:
  - Current password verification
  - New password with confirmation
  - Minimum 6 character requirement
- ✅ Account information display:
  - Role
  - Status
  - Member since date
  - Last login
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Form validation
- ✅ Success/error notifications

### 3. Navigation Integration

**Files:**
- `client/src/router/index.js` - Route configuration
- `client/src/components/layout/NavBar.vue` - Main navigation
- `client/src/components/admin/AdminHeader.vue` - Admin navigation

**Features:**
- ✅ Route: `/profile` (requires authentication)
- ✅ Profile Settings link in main navbar dropdown
- ✅ Profile Settings link in admin header dropdown
- ✅ Avatar display in navigation (if uploaded)

### 4. Storage

**Upload Directory:**
```
server/public/uploads/avatars/     - User avatar images
```

**Git Configuration:**
- ✅ Uploads folder added to `.gitignore`
- ✅ `.gitkeep` files preserve folder structure
- ✅ Only folder structure committed, not uploaded files

---

## 📊 Technical Details

### Database Schema

**Updated Tables:**
- `users` - Added/updated columns:
  - `avatar_url` - Profile picture URL
  - `phone` - Phone number
  - `last_login` - Last login timestamp
  
- `user_profiles` - Extended profile information:
  - `bio` - User biography
  - `city` - City
  - `state` - State/Province
  - `country` - Country

### File Upload Configuration

**Multer Settings:**
- **Destination:** `server/public/uploads/avatars/`
- **File Naming:** `avatar-{userId}-{timestamp}.{ext}`
- **Size Limit:** 5MB
- **Allowed Types:** image/jpeg, image/jpg, image/png, image/webp

### Security Features

- ✅ Authentication required for all profile endpoints
- ✅ Users can only update their own profile
- ✅ File type validation
- ✅ File size limits
- ✅ Secure filename generation
- ✅ Activity logging

---

## 🎨 UI/UX Features

### Profile Settings Page Layout

```
┌─────────────────────────────────────────┐
│  Profile Settings                       │
│  Manage your personal information      │
├─────────────────┬───────────────────────┤
│                 │                       │
│  [Avatar]       │  Personal Information │
│  [Upload Photo] │  ┌─────────────────┐  │
│                 │  │ Name            │  │
│  Account Info   │  │ Email           │  │
│  - Role         │  │ Phone           │  │
│  - Status       │  │ City            │  │
│  - Member Since │  │ State           │  │
│  - Last Login   │  │ Country         │  │
│                 │  └─────────────────┘  │
│                 │                       │
│                 │  Bio                  │
│                 │  [Textarea 500 chars] │
│                 │                       │
│                 │  [Save] [Reset]       │
│                 │                       │
│                 │  Change Password      │
│                 │  ┌─────────────────┐  │
│                 │  │ Current Password│  │
│                 │  │ New Password    │  │
│                 │  │ Confirm Password│  │
│                 │  └─────────────────┘  │
│                 │  [Change Password]    │
└─────────────────┴───────────────────────┘
```

### Design System

- **Colors:** Heritage Teal primary, Mantap Orange accent
- **Form Styling:** Tailwind CSS with dark mode support
- **Notifications:** Snackbar component (success/error/warning/info)
- **Icons:** Heroicons
- **Avatar:** Circular with border, fallback to initials

---

## 🚀 Usage

### For Users

1. **Access Profile Settings:**
   - Click your name in the navigation bar
   - Select "Profile Settings"

2. **Update Profile Information:**
   - Edit any field in the Personal Information section
   - Click "Save Changes"

3. **Upload Profile Picture:**
   - Click the camera icon on the avatar
   - Select an image (JPEG, PNG, WebP, max 5MB)
   - Image uploads automatically

4. **Change Password:**
   - Enter current password
   - Enter new password (minimum 6 characters)
   - Confirm new password
   - Click "Change Password"

### For Developers

**Updating Profile Data:**
```javascript
import api from '@/services/api'

// Update profile
await api.put('/users/me/profile', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+60123456789',
  bio: 'Software developer',
  city: 'Kuala Lumpur',
  state: 'Wilayah Persekutuan',
  country: 'Malaysia'
})

// Upload avatar
const formData = new FormData()
formData.append('avatar', file)
await api.post('/users/me/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

---

## 📁 Files Structure

```
server/
├── middleware/
│   └── upload.js              # File upload configuration
├── controllers/
│   └── userController.js      # Profile endpoints
├── routes/
│   └── users.js               # Route definitions
└── public/uploads/avatars/    # Avatar storage

client/
├── src/
│   ├── views/
│   │   └── ProfileSettingsView.vue
│   ├── components/
│   │   ├── layout/
│   │   │   ├── NavBar.vue     # Updated with avatar
│   │   │   └── AdminHeader.vue # Updated with profile link
│   │   └── admin/
│   │       └── AdminHeader.vue
│   └── router/
│       └── index.js           # /profile route
└── .gitignore                 # Uploads excluded
```

---

## 📝 API Documentation

### Get Profile
```http
GET /api/users/me/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+60123456789",
    "avatar_url": "/uploads/avatars/avatar-1-1234567890.png",
    "role": "admin",
    "status": "active",
    "bio": "Software developer",
    "city": "Kuala Lumpur",
    "state": "Wilayah Persekutuan",
    "country": "Malaysia",
    "created_at": "2026-01-15T08:30:00Z",
    "last_login": "2026-02-09T14:20:00Z"
  }
}
```

### Update Profile
```http
PUT /api/users/me/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+60123456789",
  "bio": "Software developer",
  "city": "Kuala Lumpur",
  "state": "Wilayah Persekutuan",
  "country": "Malaysia"
}
```

### Upload Avatar
```http
POST /api/users/me/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- avatar: [File]
```

**Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "/uploads/avatars/avatar-1-1234567890.png",
  "user": { /* updated user object */ }
}
```

---

## ✅ Testing Checklist

- [x] Profile page loads with navigation
- [x] All form fields display correctly
- [x] Save profile updates database
- [x] Avatar upload works (JPEG, PNG, WebP)
- [x] Avatar displays in profile page
- [x] Avatar displays in navigation bar
- [x] Password change works correctly
- [x] Form validation shows errors
- [x] Success notifications appear
- [x] Dark mode works
- [x] Mobile responsive
- [x] Navigation links work

---

## 🎯 Future Enhancements

### Potential Improvements

1. **Social Connections**
   - Link social media accounts
   - Display social links on profile

2. **Privacy Settings**
   - Control profile visibility
   - Hide/show contact information

3. **Two-Factor Authentication**
   - Enable 2FA
   - Backup codes

4. **Account Deletion**
   - Self-service account deletion
   - Data export before deletion

5. **Profile Completeness**
   - Progress indicator
   - Suggestions for missing info

---

## 💻 Development Notes

### Dependencies Added

**Backend:**
```bash
npm install multer
```

**Frontend:**
No new dependencies (using existing stack)

### Environment Variables

No new environment variables required.

### Database Migrations

Uses existing `user_profiles` table. No new migrations needed.

---

## 🔗 Related Modules

- **User Management** - Core user functionality
- **Authentication** - Login/logout, session management
- **Activity Logging** - Tracks profile changes
- **Notification System** - Success/error messages

---

**Last Updated:** February 9, 2026  
**Status:** Production Ready ✅  
**Maintainer:** Development Team
