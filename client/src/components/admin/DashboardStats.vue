<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/users'
import { useAuthStore } from '../../stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  newThisWeek: 0,
  newThisMonth: 0,
  activeThisWeek: 0,
  byRole: [],
  byStatus: []
})

const loading = ref(false)

// Role display names and colors
const roleConfig = {
  'super-admin': { label: 'Super Admins', color: 'bg-purple-500', icon: '👑' },
  'admin': { label: 'Admins', color: 'bg-red-500', icon: '🔧' },
  'creator': { label: 'Creators', color: 'bg-blue-500', icon: '✍️' },
  'mentor': { label: 'Mentors', color: 'bg-yellow-500', icon: '🌟' },
  'tutor': { label: 'Tutors', color: 'bg-green-500', icon: '🎓' },
  'parent': { label: 'Parents', color: 'bg-pink-500', icon: '👨‍👩‍👧' },
  'student': { label: 'Students', color: 'bg-indigo-500', icon: '👨‍🎓' },
  'publisher': { label: 'Publishers', color: 'bg-orange-500', icon: '📚' },
  'merchant': { label: 'Merchants', color: 'bg-teal-500', icon: '🏪' },
  'tuition-center': { label: 'Tuition Centers', color: 'bg-cyan-500', icon: '🏢' },
  'user': { label: 'Users', color: 'bg-gray-500', icon: '👤' }
}

const statusConfig = {
  'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
  'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  'suspended': { label: 'Suspended', color: 'bg-red-100 text-red-800' },
  'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
}

// Main stats cards
const mainStats = computed(() => [
  {
    title: 'Total Users',
    value: stats.value.totalUsers,
    icon: '👥',
    color: 'bg-blue-500',
    trend: '+12%',
    trendUp: true
  },
  {
    title: 'Active This Week',
    value: stats.value.activeThisWeek,
    icon: '📈',
    color: 'bg-green-500',
    trend: '+5%',
    trendUp: true
  },
  {
    title: 'New This Month',
    value: stats.value.newThisMonth,
    icon: '🆕',
    color: 'bg-purple-500',
    trend: '+8%',
    trendUp: true
  },
  {
    title: 'Pending Approval',
    value: stats.value.byStatus.find(s => s.status === 'pending')?.count || 0,
    icon: '⏳',
    color: 'bg-orange-500',
    trend: 'Requires attention',
    trendUp: null
  }
])

// Role distribution for chart
const roleDistribution = computed(() => {
  return stats.value.byRole
    .filter(r => r.count > 0)
    .map(r => ({
      ...r,
      ...roleConfig[r.role],
      percentage: Math.round((r.count / stats.value.totalUsers) * 100) || 0
    }))
    .sort((a, b) => b.count - a.count)
})

// Status distribution
const statusDistribution = computed(() => {
  return stats.value.byStatus.map(s => ({
    ...s,
    ...statusConfig[s.status],
    percentage: Math.round((s.count / stats.value.totalUsers) * 100) || 0
  }))
})

onMounted(async () => {
  loading.value = true
  const result = await userStore.fetchUserStats()
  if (result.success) {
    stats.value = {
      ...stats.value,
      ...result.stats.overview,
      byRole: result.stats.byRole,
      byStatus: result.stats.byStatus
    }
  }
  loading.value = false
})
</script>

<template>
  <div>
    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="stat in mainStats" 
        :key="stat.title"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
          </div>
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            :class="stat.color.replace('bg-', 'bg-opacity-10 bg-')"
          >
            {{ stat.icon }}
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span 
            v-if="stat.trendUp !== null"
            :class="stat.trendUp ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ stat.trend }}
          </span>
          <span v-else class="text-sm font-medium text-orange-600">
            {{ stat.trend }}
          </span>
          <span class="text-sm text-gray-400 ml-2">vs last period</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Role Distribution -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
        <div class="space-y-4">
          <div 
            v-for="role in roleDistribution.slice(0, 6)" 
            :key="role.role"
            class="flex items-center"
          >
            <span class="text-xl mr-3">{{ role.icon }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ role.label }}</span>
                <span class="text-sm text-gray-500">{{ role.count }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="role.color"
                  :style="{ width: `${role.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Users by Status</h3>
        <div class="space-y-4">
          <div 
            v-for="status in statusDistribution" 
            :key="status.status"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="status.color"
          >
            <div class="flex items-center">
              <span class="font-medium">{{ status.label }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-bold">{{ status.count }}</span>
              <span class="text-sm opacity-75">{{ status.percentage }}%</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-6 pt-6 border-t border-gray-100">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-indigo-600">{{ stats.newThisWeek }}</p>
              <p class="text-sm text-gray-500">New This Week</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ Math.round((stats.activeThisWeek / stats.totalUsers) * 100) || 0 }}%</p>
              <p class="text-sm text-gray-500">Active Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>