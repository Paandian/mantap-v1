<template>
  <div class="backup-management">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Backup Management
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage SQL backups of school database
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="showCleanupModal = true"
          class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
          :disabled="loading"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Auto Cleanup
        </button>
        <button
          @click="fetchBackups"
          class="px-4 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors flex items-center gap-2"
          :disabled="loading"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Backups</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalBackups || 0 }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalSize || '0 MB' }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Newest Backup</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ stats.newestBackup ? formatDate(stats.newestBackup.date) : 'No backups' }}
            </p>
          </div>
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Oldest Backup</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ stats.oldestBackup ? formatDate(stats.oldestBackup.date) : 'No backups' }}
            </p>
          </div>
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Backups Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">Available Backups</h3>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-heritageTeal mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading backups...</p>
      </div>

      <div v-else-if="backups.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="mt-2 text-gray-600 dark:text-gray-400">No backups found</p>
        <p class="text-sm text-gray-500 dark:text-gray-500">Backups are created automatically when using "Backup & Replace" import strategy</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filename</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Records</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="backup in backups" :key="backup.filename" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ backup.filename }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(backup.created) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ backup.size }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ backup.recordCount || 'Unknown' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="downloadBackup(backup.filename)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Download"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmRestore(backup)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Restore"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(backup)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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
    </div>

    <!-- Restore Confirmation Modal -->
    <div v-if="showRestoreModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Restore Database?</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Warning:</strong> This will replace ALL current school data with the backup data from:
          </p>
          <p class="text-sm font-mono text-yellow-700 dark:text-yellow-300 mt-2 bg-white dark:bg-gray-900 p-2 rounded">
            {{ selectedBackup?.filename }}
          </p>
          <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            Created: {{ selectedBackup ? formatDate(selectedBackup.created) : '' }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showRestoreModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeRestore"
            :disabled="restoring"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="restoring" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ restoring ? 'Restoring...' : 'Yes, Restore' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Backup?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete this backup file?
        </p>
        <p class="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded mb-6">
          {{ selectedBackup?.filename }}
        </p>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cleanup Modal -->
    <div v-if="showCleanupModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auto Cleanup Backups</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          This will delete old backups based on the following rules:
        </p>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keep backups newer than (days)
            </label>
            <input
              v-model.number="cleanupDays"
              type="number"
              min="1"
              max="365"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Always keep at least (backups)
            </label>
            <input
              v-model.number="cleanupCount"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> This will permanently delete backup files. Make sure you have downloaded any important backups.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showCleanupModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeCleanup"
            :disabled="cleaning"
            class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {{ cleaning ? 'Cleaning...' : 'Run Cleanup' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Notification -->
    <div
      v-if="notification"
      :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50',
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'BackupManagement',
  setup() {
    const backups = ref([])
    const stats = ref({})
    const loading = ref(false)
    const restoring = ref(false)
    const deleting = ref(false)
    const cleaning = ref(false)
    const showRestoreModal = ref(false)
    const showDeleteModal = ref(false)
    const showCleanupModal = ref(false)
    const selectedBackup = ref(null)
    const cleanupDays = ref(30)
    const cleanupCount = ref(10)
    const notification = ref(null)

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 5000)
    }

    const fetchBackups = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/schools/admin/import/backups/list', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        backups.value = response.data.backups
        stats.value = {
          totalBackups: response.data.totalBackups,
          totalSize: response.data.totalSize,
          oldestBackup: response.data.backups[response.data.backups.length - 1],
          newestBackup: response.data.backups[0]
        }
      } catch (error) {
        console.error('Failed to fetch backups:', error)
        showNotification('Failed to load backups', 'error')
      } finally {
        loading.value = false
      }
    }

    const downloadBackup = async (filename) => {
      try {
        const response = await axios.get(`/api/schools/admin/import/backups/${filename}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        showNotification('Backup downloaded successfully')
      } catch (error) {
        console.error('Download failed:', error)
        showNotification('Failed to download backup', 'error')
      }
    }

    const confirmRestore = (backup) => {
      selectedBackup.value = backup
      showRestoreModal.value = true
    }

    const executeRestore = async () => {
      if (!selectedBackup.value) return
      
      restoring.value = true
      try {
        const response = await axios.post(
          `/api/schools/admin/import/backups/${selectedBackup.value.filename}/restore`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        showNotification(`Database restored successfully! ${response.data.currentSchoolCount} schools restored.`)
        showRestoreModal.value = false
        selectedBackup.value = null
        fetchBackups() // Refresh list
      } catch (error) {
        console.error('Restore failed:', error)
        showNotification(error.response?.data?.message || 'Failed to restore backup', 'error')
      } finally {
        restoring.value = false
      }
    }

    const confirmDelete = (backup) => {
      selectedBackup.value = backup
      showDeleteModal.value = true
    }

    const executeDelete = async () => {
      if (!selectedBackup.value) return
      
      deleting.value = true
      try {
        await axios.delete(
          `/api/schools/admin/import/backups/${selectedBackup.value.filename}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        showNotification('Backup deleted successfully')
        showDeleteModal.value = false
        selectedBackup.value = null
        fetchBackups() // Refresh list
      } catch (error) {
        console.error('Delete failed:', error)
        showNotification('Failed to delete backup', 'error')
      } finally {
        deleting.value = false
      }
    }

    const executeCleanup = async () => {
      cleaning.value = true
      try {
        const response = await axios.delete(
          `/api/schools/admin/import/backups/cleanup?keepDays=${cleanupDays.value}&keepCount=${cleanupCount.value}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        showNotification(`Cleanup completed! ${response.data.deletedFiles.length} backups deleted, ${response.data.freedSpace} freed.`)
        showCleanupModal.value = false
        fetchBackups() // Refresh list
      } catch (error) {
        console.error('Cleanup failed:', error)
        showNotification('Failed to run cleanup', 'error')
      } finally {
        cleaning.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchBackups()
    })

    return {
      backups,
      stats,
      loading,
      restoring,
      deleting,
      cleaning,
      showRestoreModal,
      showDeleteModal,
      showCleanupModal,
      selectedBackup,
      cleanupDays,
      cleanupCount,
      notification,
      fetchBackups,
      downloadBackup,
      confirmRestore,
      executeRestore,
      confirmDelete,
      executeDelete,
      executeCleanup,
      formatDate
    }
  }
}
</script>

<style scoped>
.backup-management {
  @apply p-6;
}
</style>