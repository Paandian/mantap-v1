<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  roles: {
    type: Array,
    default: () => []
  },
  statuses: {
    type: Array,
    default: () => []
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  canManageStatus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-change', 'edit', 'delete', 'selection-change'])

const selectedIds = ref([])
const selectAll = ref(false)

// Reset selection when users change
watch(() => props.users, () => {
  selectedIds.value = []
  selectAll.value = false
}, { deep: true })

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = props.users.map(u => u.id)
  } else {
    selectedIds.value = []
  }
  emit('selection-change', selectedIds.value)
}

const handleSelectOne = (userId) => {
  const index = selectedIds.value.indexOf(userId)
  if (index === -1) {
    selectedIds.value.push(userId)
  } else {
    selectedIds.value.splice(index, 1)
  }
  selectAll.value = selectedIds.value.length === props.users.length
  emit('selection-change', selectedIds.value)
}

const getRoleLabel = (role) => {
  return props.roles.find(r => r.value === role)?.label || role
}

const getStatusConfig = (status) => {
  return props.statuses.find(s => s.value === status) || { label: status, color: 'gray' }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">
              <input
                v-model="selectAll"
                @change="handleSelectAll"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-12 text-center">
              <div class="flex justify-center">
                <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              No users found
            </td>
          </tr>
          <tr 
            v-for="user in users" 
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <input
                :checked="selectedIds.includes(user.id)"
                @change="handleSelectOne(user.id)"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span v-if="!user.avatar_url" class="text-indigo-600 font-semibold text-sm">
                    {{ getInitials(user.name) }}
                  </span>
                  <img v-else :src="user.avatar_url" :alt="user.name" class="h-10 w-10 rounded-full object-cover">
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="`bg-${getStatusConfig(user.status).color}-100 text-${getStatusConfig(user.status).color}-800`"
              >
                {{ getStatusConfig(user.status).label }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(user.last_login) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('edit', user)"
                  class="text-indigo-600 hover:text-indigo-900 p-1"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="canDelete"
                  @click="$emit('delete', user)"
                  class="text-red-600 hover:text-red-900 p-1"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ users.length }} of {{ totalUsers }} users
      </div>
      <div class="flex items-center space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="$emit('page-change', currentPage - 1)"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="$emit('page-change', currentPage + 1)"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>