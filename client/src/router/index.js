import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import TutorDashboard from '../views/dashboards/TutorDashboard.vue'
import StudentDashboard from '../views/dashboards/StudentDashboard.vue'
import ParentDashboard from '../views/dashboards/ParentDashboard.vue'
import ProfileSettingsView from '../views/ProfileSettingsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Role-based dashboard mapping
const roleDashboards = {
  'super-admin': '/admin',
  'admin': '/admin',
  'creator': '/admin',
  'tutor': '/dashboard/tutor',
  'mentor': '/dashboard/tutor', // Mentors use similar dashboard
  'student': '/dashboard/student',
  'parent': '/dashboard/parent',
  'publisher': '/admin', // Publishers can access content management
  'merchant': '/admin', // Merchants can access their management area
  'tuition-center': '/admin',
  'user': '/'
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guestOnly: true }
        },
        // Admin Dashboard (Super Admin, Admin, Creator)
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboardView,
            meta: { requiresAuth: true, requiresRole: ['super-admin', 'admin', 'creator', 'publisher', 'merchant', 'tuition-center'] }
        },
        // Role-specific Dashboards
        {
            path: '/dashboard/tutor',
            name: 'tutor-dashboard',
            component: TutorDashboard,
            meta: { requiresAuth: true, requiresRole: ['tutor', 'mentor'] }
        },
        {
            path: '/dashboard/student',
            name: 'student-dashboard',
            component: StudentDashboard,
            meta: { requiresAuth: true, requiresRole: ['student'] }
        },
        {
            path: '/dashboard/parent',
            name: 'parent-dashboard',
            component: ParentDashboard,
            meta: { requiresAuth: true, requiresRole: ['parent'] }
        },
        // Generic Dashboard Redirect
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: { requiresAuth: true },
            beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                const userRole = authStore.userRole
                const dashboardPath = roleDashboards[userRole] || '/'
                next(dashboardPath)
            }
        },
        // Profile Settings (All authenticated users)
        {
            path: '/profile',
            name: 'profile-settings',
            component: ProfileSettingsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    }
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // Initialize auth from localStorage
    if (!authStore.token) {
        authStore.initializeAuth()
    }

    // Redirect authenticated users away from guest-only pages (like login)
    if (to.meta.guestOnly && authStore.isAuthenticated) {
        const userRole = authStore.userRole
        const dashboardPath = roleDashboards[userRole] || '/'
        next(dashboardPath)
        return
    }

    // Check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
    }

    // Check role permissions
    if (to.meta.requiresRole && authStore.isAuthenticated) {
        const requiredRoles = to.meta.requiresRole
        const userRole = authStore.userRole
        
        if (!requiredRoles.includes(userRole)) {
            // Redirect to appropriate dashboard instead of 404
            const dashboardPath = roleDashboards[userRole] || '/'
            next(dashboardPath)
            return
        }
    }

    next()
})

export default router

// Export helper for role-based redirects
export { roleDashboards }
