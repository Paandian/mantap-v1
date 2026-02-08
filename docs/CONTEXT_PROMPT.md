# Context Prompt for Mantap.work Development

**Copy and paste this entire prompt into the AI chat to continue development seamlessly.**

---

## PROJECT CONTEXT

**Project:** Mantap.work - Educational Platform  
**Current Version:** 1.0.0  
**Status:** Core user management system complete, ready for content modules  
**Tech Stack:** Vue 3 + Node.js + MySQL + Tailwind CSS  
**Last Worked On:** February 2026

---

## ✅ COMPLETED FEATURES (Do Not Rebuild)

### 1. User Management System (COMPLETE)
- 11 user roles with hierarchy (super-admin → user)
- JWT authentication with auto-refresh
- Session management with Pinia
- User CRUD operations (create, read, update, delete)
- Bulk operations (delete multiple, status update)
- User filtering and search
- Activity logging

### 2. Dashboard Architecture (COMPLETE)
- Admin Dashboard (super-admin, admin, creator roles)
- Tutor Dashboard
- Student Dashboard  
- Parent Dashboard
- Role-based automatic routing

### 3. Authentication (COMPLETE)
- Login/Logout with JWT
- Password hashing (BCrypt)
- Session expiration handling
- Permission-based access control
- Protected routes

### 4. UI Components (COMPLETE)
- Responsive navbar with user dropdown
- Mobile menu (full-width, slide-in)
- Snackbar notifications (success/error/warning/info)
- Dark/Light mode toggle
- Language switcher (EN/BM)

### 5. API Endpoints (COMPLETE)
- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- All endpoints tested and working

### 6. Database (COMPLETE)
- Users table with role/status
- User profiles table
- Permissions system
- Activity logs
- Content tables (tutors, mentors, schools, merchants, books)

### 7. Documentation (COMPLETE)
- Full documentation in `/docs` folder
- API docs, database schema, deployment guide
- This project has comprehensive docs

### 8. Deployment (COMPLETE)
- `deploy.sh` script for one-command deployment
- PM2 configuration
- Production-ready server setup
- Nginx configuration guide

---

## 🏗️ PROJECT STRUCTURE

```
mantap/
├── client/                          # Vue.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/              # Admin dashboard components
│   │   │   ├── common/             # Snackbar, shared components
│   │   │   ├── landing/            # Landing page sections
│   │   │   └── layout/             # NavBar, Footer
│   │   ├── views/
│   │   │   ├── dashboards/         # Tutor, Student, Parent dashboards
│   │   │   ├── AdminDashboardView.vue
│   │   │   ├── LoginView.vue
│   │   │   └── NotFoundView.vue
│   │   ├── stores/
│   │   │   ├── auth.js            # Authentication state
│   │   │   ├── users.js           # User management state
│   │   │   └── notification.js    # Notification state
│   │   ├── router/index.js        # Vue Router config
│   │   └── services/api.js        # Axios configuration
│   └── dist/                      # Build output (generated)
├── server/                          # Node.js Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── models/User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── middleware/auth.js
│   ├── public/                    # Static files (built frontend)
│   ├── server.js
│   ├── ecosystem.config.js        # PM2 config
│   └── .env                       # Environment variables
├── db/                             # Database migrations
│   ├── mantap_work_db.sql
│   └── user_management_migration.sql
├── docs/                           # Documentation
│   ├── README.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── QUICK_DEPLOY.md
│   └── CHAT_SESSION_NOTES.md
└── deploy.sh                       # Deployment script
```

---

## 🚀 HOW TO RUN (Current State)

### Development Mode:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```
Access: http://localhost:8080

### Production Mode:
```bash
./deploy.sh prod
```

---

## 🎯 ROLE HIERARCHY (Important!)

```javascript
Level 10: super-admin  (Can manage everything)
Level 9:  admin         (Can manage most features)
Level 8:  creator       (Content management)
Level 5:  mentor/tutor  (Tutoring features)
Level 4:  publisher/merchant/tuition-center
Level 3:  parent
Level 2:  student
Level 1:  user
```

**Key Rule:** Users can only manage roles BELOW their level

---

## 📊 CURRENT DATABASE STATE

**Tables Created:**
- users (with roles: super-admin, admin, creator, etc.)
- user_profiles
- permissions
- role_permissions
- user_activity_logs
- tutors, mentors, schools, merchants, books, testimonials, tools

**Default Data:** Sample data exists for tutors, mentors, schools, merchants, books, testimonials

---

## 🔄 AUTHENTICATION FLOW

1. User logs in → JWT token generated
2. Token stored in localStorage
3. Auto-refresh every 5 minutes
4. Role-based redirect to appropriate dashboard
5. All protected routes check auth & permissions

---

## 🎨 UI/UX PATTERNS ESTABLISHED

### Components Use:
- Tailwind CSS for styling
- Dark mode support with `dark:` prefix
- Mobile-first responsive design
- Snackbar notifications via `useNotificationStore()`
- Consistent color scheme (heritageTeal, mantapOrange)

### State Management:
- Pinia stores in `/stores`
- Auth store: `useAuthStore()`
- Users store: `useUserStore()`
- Notifications: `useNotificationStore()`

---

## ❌ DO NOT DO (Already Done)

1. ❌ Do not rebuild user authentication system
2. ❌ Do not recreate database schema
3. ❌ Do not rebuild admin dashboard
4. ❌ Do not recreate role hierarchy
5. ❌ Do not rebuild deployment scripts
6. ❌ Do not recreate documentation structure

---

## ✅ NEXT STEPS (What to Work On)

Choose from these modules to implement next:

### Priority 1: Content Management
- [ ] Create/Edit/Delete tutors
- [ ] Create/Edit/Delete mentors
- [ ] Create/Edit/Delete schools
- [ ] Create/Edit/Delete merchants
- [ ] Create/Edit/Delete books

### Priority 2: Enhanced Features
- [ ] User profile editing (avatar upload)
- [ ] Password reset via email
- [ ] Email verification workflow
- [ ] Two-factor authentication

### Priority 3: Tutor/Student Features
- [ ] Tutor profile management
- [ ] Student enrollment system
- [ ] Parent-student linking
- [ ] Scheduling system

### Priority 4: Advanced
- [ ] Real-time messaging (WebSockets)
- [ ] Payment integration
- [ ] Review and rating system
- [ ] Advanced analytics

---

## 💡 IMPORTANT ARCHITECTURE DECISIONS

1. **Separate Dashboards:** Each role has own dashboard component (not conditional rendering)
2. **Backward Compatibility:** Database migrations are backward-compatible
3. **API Structure:** RESTful APIs at `/api/*`
4. **Static Files:** Built frontend served from `server/public/`
5. **Environment:** Use `.env` for configuration
6. **State:** Pinia for Vue state, localStorage for auth persistence

---

## 🐛 KNOWN ISSUES (If Any)

- None critical currently
- All features tested and working
- User role updates working correctly
- Mobile menu fully functional

---

## 📚 REFERENCE DOCUMENTATION

All documentation is in `/docs` folder:
- `README.md` - Project overview
- `API_DOCUMENTATION.md` - All API endpoints
- `DATABASE_SCHEMA.md` - Complete schema
- `QUICK_DEPLOY.md` - Deployment steps
- `CHAT_SESSION_NOTES.md` - Previous session summary

---

## 🎯 DEVELOPMENT WORKFLOW

### To Add a New Feature:
1. Check if database table exists (if needed)
2. Create/update backend model
3. Create/update backend controller
4. Add API route
5. Create/update frontend store
6. Create/update frontend component
7. Add route if needed
8. Test thoroughly
9. Update documentation

### Code Style:
- Use Composition API (`<script setup>`)
- Use Tailwind classes
- Use Pinia for state
- Handle errors with snackbar notifications
- Follow existing patterns

---

## 🔧 QUICK COMMANDS

```bash
# Install all dependencies
npm install

# Run development
npm run dev        # (in both client and server)

# Build for production
cd client && npm run build

# Deploy
./deploy.sh prod

# Check server status
pm2 status

# View logs
pm2 logs
```

---

## ✍️ WHEN STARTING NEW SESSION

**Say something like:**
"I want to continue developing Mantap.work. The user management system is complete. I want to work on [FEATURE_NAME]. The database has [TABLES] already set up. I need to [WHAT YOU WANT TO DO]."

**Example:**
"I want to continue developing Mantap.work. The user management system is complete. I want to add the ability to create and edit tutors from the admin dashboard. I need to create the API endpoints, update the frontend, and ensure only admins can manage tutors."

---

## 📞 CONTEXT FOR AI

When this prompt is pasted:
1. AI knows the project structure
2. AI knows what's already built
3. AI knows the tech stack
4. AI knows the patterns to follow
5. AI knows what NOT to rebuild
6. AI can immediately start helping with new features

---

**This prompt ensures seamless continuation across multiple PCs and team members.**

**Version:** 1.0.0  
**Created:** February 2026  
**Status:** Active Development
