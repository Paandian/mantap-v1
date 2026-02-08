<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../../stores/users'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import UserTable from './UserTable.vue'
import UserModal from './UserModal.vue'
import UserFilters from './UserFilters.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const showModal = ref(false)
const editingUser = ref(null)
const selectedUsers = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  search: '',
  role: null,
  status: null,
  dateFrom: null,
  dateTo: null
})

const roles = [
  { value: 'super-admin', label: 'Super Admin', level: 10 },
  { value: 'admin', label: 'Admin', level: 9 },
  { value: 'creator', label: 'Creator', level: 8 },
  { value: 'mentor', label: 'Mentor', level: 5 },
  { value: 'tutor', label: 'Tutor', level: 5 },
  { value: 'publisher', label: 'Publisher', level: 4 },
  { value: 'merchant', label: 'Merchant', level: 4 },
  { value: 'tuition-center', label: 'Tuition Center', level: 4 },
  { value: 'parent', label: 'Parent', level: 3 },
  { value: 'student', label: 'Student', level: 2 },
  { value: 'user', label: 'User', level: 1 }
]

const statuses = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'suspended', label: 'Suspended', color: 'red' }
]

// Filter roles that current user can manage
const manageableRoles = computed(() => {
  const userLevel = roles.find(r => r.value === authStore.userRole)?.level || 0
  return roles.filter(r => r.level < userLevel)
})

const canCreateUser = computed(() => {
  return ['super-admin', 'admin', 'creator'].includes(authStore.userRole)
})

const canDeleteUsers = computed(() => {
  return ['super-admin', 'admin'].includes(authStore.userRole)
})

const canManageStatus = computed(() => {
  return ['super-admin', 'admin'].includes(authStore.userRole)
})

onMounted(() => {
  fetchUsers()
})

watch([filters, currentPage], () => {
  fetchUsers()
}, { deep: true })

const fetchUsers = async () => {
  userStore.setFilters(filters.value)
  await userStore.fetchUsers({
    page: currentPage.value,
    limit: itemsPerPage.value
  })
}

const handleCreateUser = () => {
  editingUser.value = null
  showModal.value = true
}

const handleEditUser = (user) => {
  editingUser.value = user
  showModal.value = true
}

const handleDeleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.name}?`)) return
  
  const result = await userStore.deleteUser(user.id)
  if (result.success) {
    notificationStore.success('User deleted successfully')
  } else {
    notificationStore.error(result.error || 'Failed to delete user')
  }
}

const handleBulkDelete = async () => {
  if (selectedUsers.value.length === 0) return
  if (!confirm(`Are you sure you want to delete ${selectedUsers.value.length} users?`)) return
  
  const result = await userStore.bulkDeleteUsers(selectedUsers.value)
  if (result.success) {
    selectedUsers.value = []
    notificationStore.success('Users deleted successfully')
  } else {
    notificationStore.error(result.error || 'Failed to delete users')
  }
}

const handleBulkStatusUpdate = async (status) => {
  if (selectedUsers.value.length === 0) return
  
  const result = await userStore.bulkUpdateStatus(selectedUsers.value, status)
  if (result.success) {
    selectedUsers.value = []
    notificationStore.success(`Users updated to ${status} successfully`)
  } else {
    notificationStore.error(result.error || 'Failed to update users')
  }
}

const handleModalClose = () => {
  showModal.value = false
  editingUser.value = null
}

const handleUserSaved = async () => {
  const wasEditing = !!editingUser.value
  showModal.value = false
  editingUser.value = null
  await fetchUsers()
  notificationStore.success(wasEditing ? 'User updated successfully' : 'User created successfully')
}

const handleSelectionChange = (selectedIds) => {
  selectedUsers.value = selectedIds
}

const handleExport = async (format) => {
  try {
    await userStore.exportUsers(format, filters.value)
    notificationStore.success(`Users exported as ${format.toUpperCase()} successfully`)
  } catch (error) {
    notificationStore.error('Failed to export users')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
        <p class="text-gray-600 mt-1">
          Manage users, roles, and permissions across the platform
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <button
          v-if="canCreateUser"
          @click="handleCreateUser"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
        
        <div class="relative">
          <button
            @click="handleExport('csv')"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div 
      v-if="selectedUsers.length > 0"
      class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between"
    >
      <span class="text-indigo-900 font-medium">
        {{ selectedUsers.length }} user(s) selected
      </span>
      <div class="flex items-center space-x-2">
        <select
          v-if="canManageStatus"
          @change="handleBulkStatusUpdate($event.target.value)"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Change Status...</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          v-if="canDeleteUsers"
          @click="handleBulkDelete"
          class="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Selected
        </button>
      </div>
    </div>

    <!-- Filters -->
    <UserFilters 
      v-model="filters"
      :roles="manageableRoles"
      :statuses="statuses"
    />

    <!-- Users Table -->
    <UserTable
      :users="userStore.users"
      :loading="userStore.isLoading"
      :current-page="currentPage"
      :total-pages="userStore.totalPages"
      :total-users="userStore.totalUsers"
      :roles="roles"
      :statuses="statuses"
      :can-delete="canDeleteUsers"
      :can-manage-status="canManageStatus"
      @page-change="currentPage = $event"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
      @selection-change="handleSelectionChange"
    />

    <!-- User Modal -->
    <UserModal
      v-if="showModal"
      :user="editingUser"
      :roles="manageableRoles"
      @close="handleModalClose"
      @save="handleUserSaved"
    />
  </div>
</template>