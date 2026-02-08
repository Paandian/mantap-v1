<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isLoading = ref(true)

onMounted(() => {
  // Simulate loading dashboard data
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

const handleLogout = async () => {
  await authStore.logout()
  notificationStore.success('Logged out successfully')
  router.push('/')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img class="h-8 w-auto" src="/assets/logo.svg" alt="Mantap.work">
            <h1 class="ml-4 text-xl font-semibold text-gray-900">Tutor Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Welcome, {{ authStore.displayName }}</span>
            <button 
              @click="goToHome"
              class="text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Back to Site
            </button>
            <button 
              @click="handleLogout"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Welcome to your Tutor Dashboard</h2>
          <p class="text-gray-600 mt-2">
            Manage your tutoring profile, view your students, and track your progress.
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Students</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Rating</p>
                <p class="text-2xl font-bold text-gray-900">0.0</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Sessions</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">👤</span>
              <span class="text-sm font-medium text-gray-700">Edit Profile</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">📅</span>
              <span class="text-sm font-medium text-gray-700">Schedule</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">📊</span>
              <span class="text-sm font-medium text-gray-700">Analytics</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">💬</span>
              <span class="text-sm font-medium text-gray-700">Messages</span>
            </button>
          </div>
        </div>

        <!-- Coming Soon Notice -->
        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <span class="font-semibold">Coming Soon:</span> Full tutor management features including student tracking, scheduling, and messaging.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
