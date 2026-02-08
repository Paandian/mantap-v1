<script setup>
import { ref, onMounted } from 'vue'

const activities = ref([
  {
    id: 1,
    type: 'user_created',
    message: 'New user John Doe registered',
    user: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    icon: '👤',
    color: 'green'
  },
  {
    id: 2,
    type: 'user_login',
    message: 'Admin logged in from IP 192.168.1.1',
    user: 'Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    icon: '🔑',
    color: 'blue'
  },
  {
    id: 3,
    type: 'content_published',
    message: 'New article "Mathematics Tips" published',
    user: 'Creator Sarah',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: '📝',
    color: 'purple'
  },
  {
    id: 4,
    type: 'tutor_verified',
    message: 'Tutor Ahmad Rahman verified',
    user: 'Admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    icon: '✅',
    color: 'green'
  },
  {
    id: 5,
    type: 'user_updated',
    message: 'User profile updated for Jane Smith',
    user: 'Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    icon: '✏️',
    color: 'yellow'
  }
])

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return 'Just now'
}

const getActivityIcon = (type) => {
  const icons = {
    user_created: '👤',
    user_login: '🔑',
    user_logout: '🚪',
    user_updated: '✏️',
    user_deleted: '🗑️',
    content_published: '📝',
    content_updated: '📝',
    tutor_verified: '✅',
    mentor_verified: '✅',
    status_changed: '🔄'
  }
  return icons[type] || '📌'
}

const getActivityColor = (type) => {
  const colors = {
    user_created: 'bg-green-100 text-green-600',
    user_login: 'bg-blue-100 text-blue-600',
    user_logout: 'bg-gray-100 text-gray-600',
    user_updated: 'bg-yellow-100 text-yellow-600',
    user_deleted: 'bg-red-100 text-red-600',
    content_published: 'bg-purple-100 text-purple-600',
    content_updated: 'bg-purple-100 text-purple-600',
    tutor_verified: 'bg-green-100 text-green-600',
    mentor_verified: 'bg-green-100 text-green-600',
    status_changed: 'bg-orange-100 text-orange-600'
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
        View All
      </button>
    </div>
    
    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start space-x-3"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
          :class="getActivityColor(activity.type)"
        >
          {{ getActivityIcon(activity.type) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            {{ activity.message }}
          </p>
          <div class="flex items-center mt-1 text-xs text-gray-500">
            <span>{{ activity.user }}</span>
            <span class="mx-2">•</span>
            <span>{{ formatTimeAgo(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>