# Frontend Architecture Documentation

**Version:** 1.0.0  
**Framework:** Vue 3 + Vite  
**Last Updated:** February 2026

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [State Management](#state-management)
4. [Routing](#routing)
5. [Component Architecture](#component-architecture)
6. [Dashboard System](#dashboard-system)
7. [Styling](#styling)
8. [Internationalization](#internationalization)

---

## Technology Stack

### Core Framework
- **Vue 3** (v3.4.19) - Progressive JavaScript framework
- **Composition API** - Modern Vue component style
- **Vite** (v5.1.4) - Next-generation frontend tooling
- **Vue Router** (v4.3.0) - Client-side routing

### State Management
- **Pinia** (v2.1.7) - Vue's official state management

### Styling
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **PostCSS** - CSS transformations
- **Autoprefixer** - CSS vendor prefixes

### Utilities
- **Axios** (v1.6.7) - HTTP client
- **Vue I18n** (v11.2.8) - Internationalization
- **GSAP** (v3.12.5) - Animation library

### Development Tools
- **ESLint** - Code linting
- **Vite HMR** - Hot module replacement

---

## Project Structure

```
client/
├── public/                    # Static assets
│   ├── assets/
│   │   ├── logo.svg          # App logo
│   │   ├── logo-footer.svg   # Footer logo
│   │   └── img/              # Image assets
│   └── index.html            # Entry HTML
│
├── src/
│   ├── components/           # Vue components
│   │   ├── admin/           # Admin dashboard components
│   │   │   ├── AdminHeader.vue
│   │   │   ├── AdminSidebar.vue
│   │   │   ├── DashboardStats.vue
│   │   │   ├── UserManagement.vue
│   │   │   ├── UserTable.vue
│   │   │   ├── UserModal.vue
│   │   │   ├── UserFilters.vue
│   │   │   ├── QuickActions.vue
│   │   │   └── RecentActivity.vue
│   │   ├── common/          # Shared components
│   │   │   └── Snackbar.vue
│   │   ├── landing/         # Landing page sections
│   │   │   ├── HeroSection.vue
│   │   │   ├── TutorNetwork.vue
│   │   │   ├── NewMentors.vue
│   │   │   ├── SchoolsDirectory.vue
│   │   │   ├── MerchantsDirectory.vue
│   │   │   ├── AuthorizedPublishers.vue
│   │   │   ├── FreeTools.vue
│   │   │   └── Testimonials.vue
│   │   └── layout/          # Layout components
│   │       ├── NavBar.vue
│   │       └── Footer.vue
│   │
│   ├── views/               # Page views
│   │   ├── dashboards/      # Role-specific dashboards
│   │   │   ├── TutorDashboard.vue
│   │   │   ├── StudentDashboard.vue
│   │   │   └── ParentDashboard.vue
│   │   ├── HomeView.vue     # Landing page
│   │   ├── LoginView.vue    # Login page
│   │   ├── AdminDashboardView.vue
│   │   └── NotFoundView.vue
│   │
│   ├── stores/              # Pinia stores
│   │   ├── auth.js         # Authentication state
│   │   ├── users.js        # User management state
│   │   └── notification.js # Notification state
│   │
│   ├── router/              # Vue Router config
│   │   └── index.js
│   │
│   ├── services/            # API services
│   │   └── api.js          # Axios configuration
│   │
│   ├── locales/             # i18n translations
│   │   ├── en.js           # English
│   │   └── bm.js           # Bahasa Malaysia
│   │
│   ├── App.vue             # Root component
│   ├── main.js             # Entry point
│   ├── i18n.js             # i18n configuration
│   └── style.css           # Global styles
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## State Management

### Store Architecture

We use **Pinia** with separate stores for different domains:

#### 1. Auth Store (`stores/auth.js`)
**Purpose:** Authentication state and user session

**State:**
```javascript
{
  token: null,              // JWT token
  user: null,               // User object
  permissions: [],          // User permissions
  isLoading: false,         // Login loading state
  error: null,              // Error message
  sessionExpiry: null       // Token expiration
}
```

**Key Actions:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `refreshToken()` - Extend session
- `initializeAuth()` - Restore from localStorage

**Getters:**
- `isAuthenticated` - Check login status
- `userRole` - Current user role
- `hasPermission(perm)` - Check specific permission
- `canManageRole(role)` - Check hierarchy

#### 2. Users Store (`stores/users.js`)
**Purpose:** User management (CRUD operations)

**State:**
```javascript
{
  users: [],                // User list
  currentUser: null,        // Selected user
  totalUsers: 0,           // Total count
  currentPage: 1,          // Pagination
  filters: {...},          // Active filters
  isLoading: false,
  error: null
}
```

**Key Actions:**
- `fetchUsers(params)` - Get user list
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `bulkDeleteUsers(ids)` - Bulk delete
- `exportUsers(format)` - Export to CSV

#### 3. Notification Store (`stores/notification.js`)
**Purpose:** Global notifications/snackbar

**State:**
```javascript
{
  notifications: []         // Active notifications
}
```

**Actions:**
- `success(message)` - Success notification
- `error(message)` - Error notification
- `warning(message)` - Warning notification
- `info(message)` - Info notification

---

## Routing

### Route Structure

```javascript
// Router configuration
const routes = [
  // Public routes
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  
  // Protected: Admin Dashboard
  { 
    path: '/admin', 
    component: AdminDashboardView,
    meta: { 
      requiresAuth: true,
      requiresRole: ['super-admin', 'admin', 'creator'] 
    }
  },
  
  // Protected: Role-specific dashboards
  { 
    path: '/dashboard/tutor', 
    component: TutorDashboard,
    meta: { requiresAuth: true, requiresRole: ['tutor', 'mentor'] }
  },
  { 
    path: '/dashboard/student', 
    component: StudentDashboard,
    meta: { requiresAuth: true, requiresRole: ['student'] }
  },
  { 
    path: '/dashboard/parent', 
    component: ParentDashboard,
    meta: { requiresAuth: true, requiresRole: ['parent'] }
  },
  
  // Fallback
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]
```

### Navigation Guards

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 1. Initialize auth from localStorage
  authStore.initializeAuth()
  
  // 2. Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // 3. Check role permissions
  if (to.meta.requiresRole && authStore.isAuthenticated) {
    if (!to.meta.requiresRole.includes(authStore.userRole)) {
      // Redirect to appropriate dashboard
      const dashboardPath = roleDashboards[authStore.userRole]
      next(dashboardPath)
      return
    }
  }
  
  // 4. Redirect authenticated users from login
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    const dashboardPath = roleDashboards[authStore.userRole]
    next(dashboardPath)
    return
  }
  
  next()
})
```

---

## Component Architecture

### Component Naming Convention

- **Pages:** `NameView.vue` (e.g., `HomeView.vue`)
- **Dashboard Components:** `Name.vue` in `components/admin/`
- **Shared Components:** `Name.vue` in `components/common/`
- **Layout Components:** `Name.vue` in `components/layout/`
- **Landing Sections:** `Name.vue` in `components/landing/`

### Component Structure

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 2. Props & Emits
const props = defineProps({
  title: { type: String, required: true }
})

const emit = defineEmits(['update', 'delete'])

// 3. Store Instances
const authStore = useAuthStore()

// 4. Reactive State
const isLoading = ref(false)
const items = ref([])

// 5. Computed Properties
const itemCount = computed(() => items.value.length)

// 6. Methods
const fetchData = async () => {
  isLoading.value = true
  // ... fetch logic
  isLoading.value = false
}

// 7. Lifecycle Hooks
onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- Component template -->
</template>

<style scoped>
/* Component-specific styles */
</style>
```

---

## Dashboard System

### Multi-Dashboard Architecture

Instead of a single dashboard with conditional rendering, we use **separate dashboard components**:

**Benefits:**
1. **Cleaner Code** - Each dashboard only contains relevant features
2. **Better Performance** - No unnecessary components loaded
3. **Improved Security** - Less risk of exposing admin features
4. **Easier Maintenance** - Changes isolated to specific dashboards
5. **Better UX** - Role-specific navigation and features

### Dashboard Structure

```
AdminDashboardView.vue      # Full management dashboard
├── AdminSidebar.vue        # Navigation
├── AdminHeader.vue         # Header with user menu
├── DashboardStats.vue      # Statistics cards
├── UserManagement.vue      # User CRUD
├── QuickActions.vue        # Quick action buttons
└── RecentActivity.vue      # Activity feed

TutorDashboard.vue          # Tutor-specific
├── Stats Cards            # Students, Rating, Sessions
└── Quick Actions          # Profile, Schedule, Analytics

StudentDashboard.vue        # Student-specific
├── Stats Cards            # Courses, Completed, Streak
└── Quick Actions          # Find Tutor, Resources

ParentDashboard.vue         # Parent-specific
├── Stats Cards            # Children, Tutors, Reports
└── Quick Actions          # Add Child, Find Tutor
```

### Dashboard Routing

```javascript
// Role-based dashboard mapping
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

---

## Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class
  theme: {
    extend: {
      colors: {
        heritageTeal: '#0d9488',
        mantapOrange: '#f97316',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      }
    }
  }
}
```

### CSS Architecture

1. **Utility-First:** Use Tailwind classes primarily
2. **Component Styles:** Use `<style scoped>` for component-specific CSS
3. **Global Styles:** Minimal global styles in `style.css`
4. **Dark Mode:** Support via `dark:` prefix

### Example Usage

```vue
<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h2>
    <p class="mt-2 text-gray-600 dark:text-gray-300">
      {{ description }}
    </p>
  </div>
</template>
```

---

## Internationalization

### i18n Configuration

```javascript
// i18n.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import bm from './locales/bm.js'

const i18n = createI18n({
  locale: localStorage.getItem('user-locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, bm }
})
```

### Translation Structure

```javascript
// locales/en.js
export default {
  nav: {
    tutors: 'Tutors',
    mentors: 'Mentors',
    schools: 'Schools',
    merchants: 'Merchants',
    tools: 'Tools',
    login: 'Log In'
  },
  // ... more translations
}
```

### Usage in Components

```vue
<template>
  <nav>
    <a href="#tutors">{{ t('nav.tutors') }}</a>
    <button>{{ t('nav.login') }}</button>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('user-locale', lang)
}
</script>
```

---

## API Integration

### Axios Configuration

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',  // Proxied to backend
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Vite Proxy Configuration

```javascript
// vite.config.js
export default {
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
```

---

## Build & Development

### Development

```bash
cd client
npm install
npm run dev
```

**Development Server:** http://localhost:8080

### Production Build

```bash
npm run build
```

**Output:** `dist/` folder

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Performance Optimizations

1. **Lazy Loading:** Dashboard components loaded on demand
2. **Pagination:** User lists paginated (10 items per page)
3. **Debouncing:** Search inputs debounced (300ms)
4. **Keep-Alive:** Dashboard tabs keep state
5. **Asset Optimization:** Images optimized in public folder

---

## Best Practices

### Component Design
1. **Single Responsibility** - One component, one purpose
2. **Props Down, Events Up** - Clear data flow
3. **Composition API** - Use `<script setup>`
4. **Type Safety** - Consider TypeScript for future

### State Management
1. **Pinia for Global State** - Auth, Users, Notifications
2. **Local State for UI** - Loading states, modals
3. **Computed for Derived Data** - Calculated values

### API Calls
1. **Store Actions for API** - Centralized data fetching
2. **Error Handling** - Always catch errors
3. **Loading States** - Show feedback during requests

---

*For backend API, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)*  
*For authentication, see [AUTHENTICATION.md](./AUTHENTICATION.md)*
