<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['logout'])

const authStore = useAuthStore()
const showDropdown = ref(false)

const handleLogout = () => {
  emit('logout')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
    <!-- Left side - Breadcrumb or page title -->
    <div class="flex items-center">
      <h2 class="text-lg font-semibold text-gray-800">Admin Panel</h2>
    </div>

    <!-- Right side - Notifications and User Menu -->
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <button class="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- User Dropdown -->
      <div class="relative">
        <button 
          @click="toggleDropdown"
          class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span class="text-indigo-600 font-semibold text-sm">
              {{ authStore.userInitials }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">
            {{ authStore.displayName }}
          </span>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">{{ authStore.displayName }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
          
          <router-link 
            to="/admin?tab=profile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="showDropdown = false"
          >
            Profile Settings
          </router-link>
          
          <button 
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>