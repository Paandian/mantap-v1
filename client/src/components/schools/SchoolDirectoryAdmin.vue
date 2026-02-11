<template>
  <div class="school-directory">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          School Directory
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage {{ totalSchools.toLocaleString() }} schools from Malaysia
        </p>
      </div>
      <div class="flex gap-3">
        <!-- Enhanced Import Dropdown -->
        <div class="relative">
          <button
            @click="showEnhancedImportModal = true"
            class="px-4 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Bulk Import
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">NEW</span>
          </button>
        </div>
        
        <!-- Legacy Import (Hidden but accessible) -->
        <button
          @click="showImportModal = true"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          title="Legacy Import (Old Version)"
        >
          Legacy
        </button>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-mantapOrange text-white rounded-lg hover:bg-mantapOrange/90 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add School
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="filters.search"
            @input="debouncedSearch"
            type="text"
            placeholder="School name or code..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
          <select
            v-model="filters.negeri"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
          >
            <option value="">All States</option>
            <option v-for="state in filterOptions.states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
          <select
            v-model="filters.peringkat"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="Rendah">Primary (Rendah)</option>
            <option value="Menengah">Secondary (Menengah)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <select
            v-model="filters.jenis"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            <option v-for="type in filterOptions.types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Schools Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  :checked="selectedSchools.length === schools.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-heritageTeal focus:ring-heritageTeal"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                School
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stats
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="school in schools" :key="school.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="school.id"
                  v-model="selectedSchools"
                  class="rounded border-gray-300 text-heritageTeal focus:ring-heritageTeal"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      :src="school.logo_url || '/images/school-placeholder.svg'"
                      :alt="school.nama_sekolah"
                      class="h-10 w-10 rounded-lg object-cover"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ school.nama_sekolah }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ school.kod_sekolah }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">{{ school.bandar }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ school.negeri }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTypeClass(school.jenis)">
                  {{ school.jenis }}
                </span>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ school.peringkat }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ school.jumlah_murid?.toLocaleString() || 0 }} students
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ school.jumlah_guru || 0 }} teachers
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(school.status_claim)"
                >
                  {{ school.status_claim }}
                </span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewSchool(school)"
                    class="text-heritageTeal hover:text-heritageTeal/80"
                    title="View"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button
                    @click="editSchool(school)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(school)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedSchools.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ selectedSchools.length }} school(s) selected
          </span>
          <button
            @click="confirmBulkDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ ((currentPage - 1) * 20) + 1 }} to {{ Math.min(currentPage * 20, totalSchools) }} of {{ totalSchools }} schools
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- School Form Modal -->
    <SchoolFormModal
      v-if="showFormModal"
      :school="editingSchool"
      @close="closeFormModal"
      @save="handleSave"
    />

    <!-- Legacy Import Modal -->
    <SchoolImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="handleImported"
    />

    <!-- Enhanced Import Modal (Smart Normalization) -->
    <EnhancedSchoolImportModal
      v-if="showEnhancedImportModal"
      @close="showEnhancedImportModal = false"
      @imported="handleEnhancedImported"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :title="'Delete School'"
      :message="`Are you sure you want to delete ${schoolToDelete?.nama_sekolah}? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSchoolStore } from '@/stores/schools'
import { useNotificationStore } from '@/stores/notification'
import SchoolFormModal from './SchoolFormModal.vue'
import SchoolImportModal from './SchoolImportModal.vue'
import EnhancedSchoolImportModal from './EnhancedSchoolImportModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const schoolStore = useSchoolStore()
const notificationStore = useNotificationStore()

// State
const showFormModal = ref(false)
const showImportModal = ref(false)
const showEnhancedImportModal = ref(false)
const showDeleteModal = ref(false)
const editingSchool = ref(null)
const schoolToDelete = ref(null)
const selectedSchools = ref([])

// Computed
const schools = computed(() => schoolStore.schools)
const totalSchools = computed(() => schoolStore.totalSchools)
const currentPage = computed(() => schoolStore.currentPage)
const totalPages = computed(() => schoolStore.totalPages)
const filters = computed(() => schoolStore.filters)
const filterOptions = computed(() => schoolStore.filterOptions)

// Methods
onMounted(async () => {
  await Promise.all([
    schoolStore.fetchSchools(),
    schoolStore.fetchFilterOptions()
  ])
})

let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
}

const applyFilters = () => {
  schoolStore.setFilters({ ...filters.value })
  schoolStore.fetchSchools({ page: 1 })
}

const clearFilters = () => {
  schoolStore.clearFilters()
  schoolStore.fetchSchools({ page: 1 })
}

const changePage = (page) => {
  schoolStore.fetchSchools({ page })
}

const openCreateModal = () => {
  editingSchool.value = null
  showFormModal.value = true
}

const editSchool = (school) => {
  editingSchool.value = school
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  editingSchool.value = null
}

const handleSave = async (schoolData) => {
  try {
    if (editingSchool.value) {
      await schoolStore.updateSchool(editingSchool.value.id, schoolData)
      notificationStore.success('School updated successfully')
    } else {
      await schoolStore.createSchool(schoolData)
      notificationStore.success('School created successfully')
    }
    closeFormModal()
    schoolStore.fetchSchools()
  } catch (error) {
    notificationStore.error(error.message)
  }
}

const confirmDelete = (school) => {
  schoolToDelete.value = school
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await schoolStore.deleteSchool(schoolToDelete.value.id)
    notificationStore.success('School deleted successfully')
    showDeleteModal.value = false
    schoolToDelete.value = null
  } catch (error) {
    notificationStore.error(error.message)
  }
}

const confirmBulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedSchools.value.length} schools?`)) {
    handleBulkDelete()
  }
}

const handleBulkDelete = async () => {
  try {
    await schoolStore.bulkDeleteSchools(selectedSchools.value)
    notificationStore.success(`${selectedSchools.value.length} schools deleted successfully`)
    selectedSchools.value = []
  } catch (error) {
    notificationStore.error(error.message)
  }
}

const toggleSelectAll = () => {
  if (selectedSchools.value.length === schools.value.length) {
    selectedSchools.value = []
  } else {
    selectedSchools.value = schools.value.map(s => s.id)
  }
}

const viewSchool = (school) => {
  window.open(`/schools/${school.id}`, '_blank')
}

const handleImported = () => {
  showImportModal.value = false
  schoolStore.fetchSchools()
  notificationStore.success('Schools imported successfully')
}

const handleEnhancedImported = (result) => {
  showEnhancedImportModal.value = false
  schoolStore.fetchSchools()
  schoolStore.fetchFilterOptions() // Refresh filter options with normalized data
  
  const totalProcessed = result.imported + result.updated
  notificationStore.success(
    `Import completed! ${totalProcessed} schools processed (${result.imported} new, ${result.updated} updated)`
  )
}

const getTypeClass = (jenis) => {
  const classes = {
    'SK': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'SMK': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'SJKC': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'SJKT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return classes[jenis] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStatusClass = (status) => {
  const classes = {
    'CLAIMED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'UNCLAIMED': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.school-directory {
  @apply p-6;
}
</style>
