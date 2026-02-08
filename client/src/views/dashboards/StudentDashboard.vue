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
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img class="h-8 w-auto" src="/assets/logo.svg" alt="Mantap.work">
            <h1 class="ml-4 text-xl font-semibold text-gray-900">Student Dashboard</h1>
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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Welcome to your Learning Dashboard</h2>
          <p class="text-gray-600 mt-2">
            Track your progress, find tutors, and access learning resources.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Courses</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Completed</p>
                <p class="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Streak</p>
                <p class="text-2xl font-bold text-gray-900">0 days</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">🎓</span>
              <span class="text-sm font-medium text-gray-700">Find Tutor</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">📚</span>
              <span class="text-sm font-medium text-gray-700">Resources</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">📊</span>
              <span class="text-sm font-medium text-gray-700">Progress</span>
            </button>
            <button class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center">
              <span class="text-3xl mb-2 block">💬</span>
              <span class="text-sm font-medium text-gray-700">Messages</span>
            </button>
          </div>
        </div>

        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <span class="font-semibold">Coming Soon:</span> Personalized learning paths, progress tracking, and tutor matching.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
