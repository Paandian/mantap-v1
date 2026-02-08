<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/users'
import { useNotificationStore } from '../stores/notification'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminHeader from '../components/admin/AdminHeader.vue'
import DashboardStats from '../components/admin/DashboardStats.vue'
import UserManagement from '../components/admin/UserManagement.vue'
import QuickActions from '../components/admin/QuickActions.vue'
import RecentActivity from '../components/admin/RecentActivity.vue'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const activeTab = ref('dashboard')
const isSidebarOpen = ref(true)

const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', roles: ['super-admin', 'admin', 'creator', 'mentor', 'tutor'] },
  { id: 'users', name: 'Users', icon: '👥', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'content', name: 'Content', icon: '📝', roles: ['super-admin', 'admin', 'creator', 'publisher'] },
  { id: 'tutors', name: 'Tutors', icon: '🎓', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'mentors', name: 'Mentors', icon: '🌟', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'schools', name: 'Schools', icon: '🏫', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'merchants', name: 'Merchants', icon: '🏪', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'publishers', name: 'Publishers', icon: '📚', roles: ['super-admin', 'admin', 'creator'] },
  { id: 'books', name: 'Books', icon: '📖', roles: ['super-admin', 'admin', 'creator', 'publisher'] },
  { id: 'settings', name: 'Settings', icon: '⚙️', roles: ['super-admin', 'admin'] }
]

// Filter tabs based on user role
const availableTabs = computed(() => {
  return tabs.filter(tab => tab.roles.includes(authStore.userRole))
})

const currentView = computed(() => {
  switch (activeTab.value) {
    case 'dashboard':
      return 'dashboard'
    case 'users':
      return 'users'
    default:
      return 'coming-soon'
  }
})

onMounted(async () => {
  // Initialize auth
  authStore.initializeAuth()
  
  // Fetch user stats
  const result = await userStore.fetchUserStats()
  if (!result.success) {
    notificationStore.error('Failed to load dashboard statistics')
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const handleLogout = async () => {
  await authStore.logout()
  notificationStore.success('Logged out successfully')
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-jakarta">
    <!-- Sidebar -->
    <AdminSidebar 
      :tabs="availableTabs"
      :active-tab="activeTab"
      :is-open="isSidebarOpen"
      @tab-change="handleTabChange"
      @toggle="toggleSidebar"
    />

    <!-- Main Content -->
    <div 
      class="transition-all duration-300"
      :class="isSidebarOpen ? 'ml-64' : 'ml-16'"
    >
      <!-- Header -->
      <AdminHeader 
        :user="authStore.user"
        @logout="handleLogout"
      />

      <!-- Content Area -->
      <main class="p-6">
        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">
              Welcome back, {{ authStore.displayName }}!
            </h1>
            <p class="text-gray-600 mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>

          <!-- Stats Grid -->
          <DashboardStats class="mb-8" />

          <!-- Quick Actions & Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <RecentActivity />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>

        <!-- Users Management View -->
        <UserManagement v-else-if="currentView === 'users'" />

        <!-- Coming Soon View -->
        <div v-else class="text-center py-20">
          <div class="text-6xl mb-4">🚧</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p class="text-gray-600">This feature is under development.</p>
        </div>
      </main>
    </div>
  </div>
</template>
