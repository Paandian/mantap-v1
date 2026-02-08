<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const quickActions = ref([
  {
    id: 'create-user',
    name: 'Create User',
    description: 'Add a new user to the platform',
    icon: '👤',
    color: 'bg-blue-500',
    roles: ['super-admin', 'admin', 'creator'],
    route: 'users'
  },
  {
    id: 'manage-content',
    name: 'Manage Content',
    description: 'Create or edit platform content',
    icon: '📝',
    color: 'bg-green-500',
    roles: ['super-admin', 'admin', 'creator', 'publisher'],
    route: 'content'
  },
  {
    id: 'verify-tutors',
    name: 'Verify Tutors',
    description: 'Review and verify tutor applications',
    icon: '🎓',
    color: 'bg-purple-500',
    roles: ['super-admin', 'admin', 'creator'],
    route: 'tutors'
  },
  {
    id: 'pending-approvals',
    name: 'Pending Approvals',
    description: 'Review pending user registrations',
    icon: '⏳',
    color: 'bg-orange-500',
    roles: ['super-admin', 'admin'],
    route: 'users'
  },
  {
    id: 'system-settings',
    name: 'System Settings',
    description: 'Configure platform settings',
    icon: '⚙️',
    color: 'bg-gray-500',
    roles: ['super-admin', 'admin'],
    route: 'settings'
  },
  {
    id: 'view-reports',
    name: 'View Reports',
    description: 'Access analytics and reports',
    icon: '📊',
    color: 'bg-indigo-500',
    roles: ['super-admin', 'admin', 'creator'],
    route: 'dashboard'
  }
])

// Filter actions based on user role
const availableActions = quickActions.value.filter(action => 
  action.roles.includes(authStore.userRole)
).slice(0, 4)

const emit = defineEmits(['action-click'])

const handleActionClick = (action) => {
  emit('action-click', action)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    
    <div class="space-y-3">
      <button
        v-for="action in availableActions"
        :key="action.id"
        @click="handleActionClick(action)"
        class="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform"
          :class="action.color.replace('bg-', 'bg-opacity-10 bg-')"
        >
          {{ action.icon }}
        </div>
        <div class="ml-3 text-left flex-1">
          <p class="text-sm font-medium text-gray-900">{{ action.name }}</p>
          <p class="text-xs text-gray-500">{{ action.description }}</p>
        </div>
        <svg 
          class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>