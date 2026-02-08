# Mantap.work - Project Documentation

## Overview

**Mantap.work** is a comprehensive educational platform connecting students, parents, tutors, mentors, schools, and educational merchants in Malaysia. The platform provides a centralized hub for educational resources, tutor discovery, school directories, and learning management.

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** In Development

---

## Project Structure

```
mantap/
├── client/                 # Vue.js Frontend Application
│   ├── src/
│   │   ├── components/     # Vue Components
│   │   ├── views/          # Page Views
│   │   ├── stores/         # Pinia State Management
│   │   ├── router/         # Vue Router Configuration
│   │   └── services/       # API Services
│   └── public/             # Static Assets
├── server/                 # Node.js Backend API
│   ├── controllers/        # Request Handlers
│   ├── models/             # Database Models
│   ├── routes/             # API Routes
│   ├── middleware/         # Express Middleware
│   └── config/             # Configuration Files
├── db/                     # Database Migrations & Schema
└── docs/                   # Documentation (This folder)
```

---

## Core Features

### 1. User Management System
- **Role-Based Access Control (RBAC)** with 11 user roles
- Hierarchical permission system
- JWT authentication with session management
- User profile management
- Activity logging

### 2. Multi-Role Dashboard Architecture
- **Admin Dashboard** - Full system management
- **Tutor Dashboard** - Profile & student management
- **Student Dashboard** - Learning progress tracking
- **Parent Dashboard** - Child monitoring & tutor management

### 3. Content Management
- Tutor network management
- Mentor directory
- School directory with claim system
- Educational merchant listings
- Book catalog (educational publishers)

### 4. Educational Tools
- Reunion planner
- Resume creator
- Uniform guide
- Passport photo editor

---

## Technology Stack

### Frontend
- **Vue 3** (Composition API)
- **Pinia** - State Management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vue I18n** - Internationalization (EN/BM)
- **GSAP** - Animations

### Backend
- **Node.js** with Express
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing
- **CORS** - Cross-origin requests

### Database
- **MySQL 8.0+**
- Supports role-based permissions
- Activity logging system
- User profile extensions

---

## Key Architecture Decisions

### 1. Role Hierarchy
Implemented a 10-level hierarchy to control access:
```
Super-admin (10) → Admin (9) → Creator (8) → Mentor/Tutor (5) → 
Publisher/Merchant/Tuition-center (4) → Parent (3) → Student (2) → User (1)
```

### 2. Dashboard Separation
**Decision:** Separate dashboards for different user types  
**Rationale:** 
- Better user experience (role-specific features)
- Easier maintenance
- Improved security
- Scalable for future features

### 3. Database Schema Evolution
**Decision:** Backward-compatible schema updates  
**Rationale:**
- Graceful migrations
- Fallback queries for missing columns
- No breaking changes during updates

### 4. Notification System
**Decision:** Global snackbar notifications via Pinia store  
**Rationale:**
- Consistent UX across the app
- Centralized error handling
- Non-intrusive user feedback

---

## Quick Links

- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [User Management System](./USER_MANAGEMENT.md)
- [Authentication Flow](./AUTHENTICATION.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Changelog](./CHANGELOG.md)

---

## Development Team

**Lead Developer:** Maruthu  
**Project Start:** February 2026  
**Current Phase:** Core Feature Development

---

## Contact & Support

**Email:** support@mantap.work  
**Documentation:** `/docs` folder in repository  
**Issues:** Report via GitHub issues

---

*This documentation is actively maintained. Last updated: February 2026*
