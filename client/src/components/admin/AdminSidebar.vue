<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['tab-change', 'toggle'])

const authStore = useAuthStore()

const userRoleDisplay = computed(() => {
  const roleMap = {
    'super-admin': 'Super Admin',
    'admin': 'Administrator',
    'creator': 'Content Creator',
    'mentor': 'Mentor',
    'tutor': 'Tutor',
    'parent': 'Parent',
    'student': 'Student',
    'publisher': 'Publisher',
    'merchant': 'Merchant',
    'tuition-center': 'Tuition Center'
  }
  return roleMap[authStore.userRole] || authStore.userRole
})

const handleTabClick = (tabId) => {
  emit('tab-change', tabId)
}

const toggleSidebar = () => {
  emit('toggle')
}
</script>

<template>
  <aside 
    class="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50"
    :class="isOpen ? 'w-64' : 'w-16'"
  >
    <!-- Logo Section -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
      <router-link to="/" class="flex items-center space-x-2 overflow-hidden">
        <img 
          src="/assets/logo.svg" 
          alt="Mantap.work" 
          class="h-8 w-8 flex-shrink-0"
        />
        <span 
          class="font-bold text-xl text-indigo-600 whitespace-nowrap transition-opacity duration-300"
          :class="isOpen ? 'opacity-100' : 'opacity-0'"
        >
          Admin
        </span>
      </router-link>
      <button 
        @click="toggleSidebar"
        class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        :title="isOpen ? 'Collapse' : 'Expand'"
      >
        <svg 
          class="w-5 h-5 text-gray-500 transform transition-transform duration-300"
          :class="isOpen ? '' : 'rotate-180'"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- User Profile Summary -->
    <div 
      class="p-4 border-b border-gray-200"
      :class="isOpen ? '' : 'px-2'"
    >
      <div class="flex items-center space-x-3">
        <div 
          class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
          :class="isOpen ? '' : 'w-8 h-8'"
        >
          <span class="text-indigo-600 font-semibold text-sm">
            {{ authStore.userInitials }}
          </span>
        </div>
        <div 
          class="overflow-hidden transition-opacity duration-300"
          :class="isOpen ? 'opacity-100' : 'opacity-0 w-0'"
        >
          <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.displayName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ userRoleDisplay }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li v-for="tab in tabs" :key="tab.id">
          <button
            @click="handleTabClick(tab.id)"
            class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="[
              activeTab === tab.id 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            :title="!isOpen ? tab.name : ''"
          >
            <span class="text-xl flex-shrink-0">{{ tab.icon }}</span>
            <span 
              class="text-sm font-medium whitespace-nowrap transition-opacity duration-300"
              :class="isOpen ? 'opacity-100' : 'opacity-0 w-0'"
            >
              {{ tab.name }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div 
      class="p-4 border-t border-gray-200"
      :class="isOpen ? '' : 'px-2'"
    >
      <router-link 
        to="/"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        :class="isOpen ? '' : 'justify-center'"
        :title="!isOpen ? 'Back to Site' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span 
          class="text-sm font-medium whitespace-nowrap transition-opacity duration-300"
          :class="isOpen ? 'opacity-100' : 'opacity-0 w-0'"
        >
          Back to Site
        </span>
      </router-link>
    </div>
  </aside>
</template>
