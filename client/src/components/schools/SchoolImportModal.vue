<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Bulk Import Schools
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Step 1: Instructions -->
        <div v-if="step === 1" class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-semibold text-blue-900 dark:text-blue-200 mb-2">Excel File Format</h3>
            <p class="text-sm text-blue-800 dark:text-blue-300 mb-4">
              Your Excel file should have the following columns:
            </p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600 dark:text-gray-400">• KODSEKOLAH (School Code)</div>
              <div class="text-gray-600 dark:text-gray-400">• NAMASEKOLAH (School Name)</div>
              <div class="text-gray-600 dark:text-gray-400">• NEGERI (State)</div>
              <div class="text-gray-600 dark:text-gray-400">• PPD (District Office)</div>
              <div class="text-gray-600 dark:text-gray-400">• PERINGKAT (Level)</div>
              <div class="text-gray-600 dark:text-gray-400">• JENIS (Type)</div>
              <div class="text-gray-600 dark:text-gray-400">• ALAMATSURAT (Address)</div>
              <div class="text-gray-600 dark:text-gray-400">• POSKODSURAT (Postcode)</div>
              <div class="text-gray-600 dark:text-gray-400">• BANDARSURAT (City)</div>
              <div class="text-gray-600 dark:text-gray-400">• NOTELEFON (Phone)</div>
              <div class="text-gray-600 dark:text-gray-400">• NOFAX (Fax)</div>
              <div class="text-gray-600 dark:text-gray-400">• EMAIL</div>
              <div class="text-gray-600 dark:text-gray-400">• MURID (Students)</div>
              <div class="text-gray-600 dark:text-gray-400">• GURU (Teachers)</div>
            </div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 class="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">Important Notes</h3>
            <ul class="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 list-disc list-inside">
              <li>Existing schools will be updated, not duplicated</li>
              <li>Large files may take several minutes to process</li>
              <li>Supported formats: .xlsx, .xls</li>
              <li>Maximum file size: 50MB</li>
            </ul>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Excel File
            </label>
            <div
              @dragover.prevent
              @drop.prevent="handleDrop"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-heritageTeal dark:hover:border-heritageTeal transition-colors cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="handleFileSelect"
              />
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium text-heritageTeal">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Excel files only (.xlsx, .xls)
              </p>
              <p v-if="selectedFile" class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Selected: {{ selectedFile.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Processing -->
        <div v-else-if="step === 2" class="text-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-heritageTeal mx-auto mb-4"></div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Processing Schools...
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Please wait while we import your data. This may take a few minutes.
          </p>
          <div class="mt-4 max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-heritageTeal h-2 rounded-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>

        <!-- Step 3: Results -->
        <div v-else-if="step === 3" class="space-y-6">
          <div v-if="importSuccess" class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg class="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Import Complete!
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Schools have been successfully imported into the database.
            </p>

            <!-- Statistics -->
            <div class="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ importResult.imported }}
                </div>
                <div class="text-sm text-green-700 dark:text-green-300">New Schools</div>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ importResult.updated }}
                </div>
                <div class="text-sm text-blue-700 dark:text-blue-300">Updated</div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ importResult.failed }}
                </div>
                <div class="text-sm text-red-700 dark:text-red-300">Failed</div>
              </div>
            </div>

            <!-- Errors -->
            <div v-if="importResult.errors && importResult.errors.length > 0" class="mt-6 text-left">
              <h4 class="font-medium text-red-600 dark:text-red-400 mb-2">Errors:</h4>
              <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 max-h-40 overflow-y-auto">
                <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li v-for="(error, index) in importResult.errors.slice(0, 10)" :key="index">
                    {{ error }}
                  </li>
                  <li v-if="importResult.errors.length > 10" class="text-red-500">
                    ... and {{ importResult.errors.length - 10 }} more errors
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg class="h-8 w-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Import Failed
            </h3>
            <p class="text-red-600 dark:text-red-400">
              {{ errorMessage }}
            </p>
          </div>
        </div>

        <!-- Import History -->
        <div v-if="importHistory.length > 0" class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">Recent Import History</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Date</th>
                  <th class="px-4 py-2 text-left text-gray-600 dark:text-gray-400">Batch ID</th>
                  <th class="px-4 py-2 text-right text-gray-600 dark:text-gray-400">Total</th>
                  <th class="px-4 py-2 text-right text-gray-600 dark:text-gray-400">New</th>
                  <th class="px-4 py-2 text-right text-gray-600 dark:text-gray-400">Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="log in importHistory.slice(0, 5)" :key="log.id" class="text-gray-700 dark:text-gray-300">
                  <td class="px-4 py-2">{{ formatDate(log.started_at) }}</td>
                  <td class="px-4 py-2 font-mono text-xs">{{ log.batch_id }}</td>
                  <td class="px-4 py-2 text-right">{{ log.total_records }}</td>
                  <td class="px-4 py-2 text-right text-green-600">{{ log.imported_records }}</td>
                  <td class="px-4 py-2 text-right text-blue-600">{{ log.updated_records }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
        <button
          v-if="step === 1"
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          v-if="step === 1"
          type="button"
          @click="console.log('Button clicked!'); startImport()"
          :disabled="!selectedFile"
          class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Start Import
        </button>
        <button
          v-if="step === 3"
          type="button"
          @click="$emit('imported')"
          class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSchoolStore } from '@/stores/schools'
import api from '@/services/api'

const emit = defineEmits(['close', 'imported'])

const schoolStore = useSchoolStore()

const step = ref(1)
const selectedFile = ref(null)
const isProcessing = ref(false)
const importSuccess = ref(false)
const importResult = ref({ imported: 0, updated: 0, failed: 0, errors: [] })
const errorMessage = ref('')
const importHistory = ref([])

onMounted(async () => {
  await loadImportHistory()
})

const loadImportHistory = async () => {
  try {
    await schoolStore.fetchImportHistory()
    importHistory.value = schoolStore.importHistory
  } catch (error) {
    console.error('Error loading import history:', error)
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateFile(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    validateFile(file)
  }
}

const validateFile = (file) => {
  console.log('Validating file:', file.name, 'Type:', file.type, 'Size:', file.size)
  
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  
  if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    alert('Please upload a valid Excel file (.xlsx or .xls)')
    return
  }
  
  if (file.size > 50 * 1024 * 1024) {
    alert('File size must be less than 50MB')
    return
  }
  
  selectedFile.value = file
  console.log('File selected successfully:', file.name)
}

const startImport = async () => {
  if (!selectedFile.value) {
    console.log('No file selected')
    return
  }
  
  console.log('Starting import with file:', selectedFile.value.name)
  step.value = 2
  isProcessing.value = true
  
  try {
    // Create FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    console.log('Uploading file to server...')
    
    // Upload file to server
    const response = await api.post('/schools/admin/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    console.log('Import response:', response.data)
    
    // Set real results from server
    importResult.value = {
      imported: response.data.imported || 0,
      updated: response.data.updated || 0,
      failed: response.data.failed || 0,
      errors: response.data.errors || []
    }
    
    importSuccess.value = true
    step.value = 3
    
    // Reload import history
    await loadImportHistory()
    
    console.log('Import completed successfully')
    
  } catch (error) {
    console.error('Import error:', error)
    console.error('Error response:', error.response)
    errorMessage.value = error.response?.data?.message || error.message || 'An error occurred during import'
    importSuccess.value = false
    step.value = 3
  } finally {
    isProcessing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
