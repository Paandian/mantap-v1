<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-heritageTeal/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-heritageTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Enhanced Bulk Import
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Smart name normalization & import strategies
            </p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 140px);">
        <!-- Step 1: File Upload -->
        <div v-if="step === 1" class="space-y-6">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm">Smart Import Features</h3>
                <div class="grid grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-300">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Auto-normalizes state & city names</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Merge, Drop, or Backup & Replace</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Preview & validate before import</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Automatic SQL backups</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Excel Format Info -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Required: KODSEKOLAH, NAMASEKOLAH, NEGERI, PPD, BANDARSURAT
            </h3>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Upload Excel File
            </label>
            <div
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
              :class="[
                'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                selectedFile 
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-heritageTeal dark:hover:border-heritageTeal'
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="handleFileSelect"
              />
              
              <div v-if="!selectedFile">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-heritageTeal">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Excel files only (.xlsx, .xls) • Max 50MB
                </p>
              </div>
              
              <div v-else class="flex items-center justify-center gap-3">
                <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button 
                  @click.stop="selectedFile = null"
                  class="ml-4 text-red-500 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Import Strategy Selection -->
          <div v-if="selectedFile" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <h3 class="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              Choose Import Strategy
            </h3>
            
            <div class="space-y-2">
              <label 
                v-for="strategy in importStrategies" 
                :key="strategy.value"
                :class="[
                  'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                  selectedStrategy === strategy.value
                    ? 'border-heritageTeal bg-heritageTeal/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                ]"
              >
                <input
                  type="radio"
                  :value="strategy.value"
                  v-model="selectedStrategy"
                  class="mt-0.5 w-4 h-4 text-heritageTeal"
                />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white text-sm">{{ strategy.label }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{{ strategy.description }}</div>
                  <div v-if="strategy.warning" class="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ strategy.warning }}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 2: Validation & Preview -->
        <div v-else-if="step === 2" class="space-y-6">
          <div v-if="validating" class="text-center py-12">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-heritageTeal mx-auto mb-4"></div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Analyzing Data...
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Validating and normalizing school data
            </p>
          </div>

          <div v-else-if="validationResult" class="space-y-6">
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ validationResult.totalRows }}</div>
                <div class="text-sm text-blue-800 dark:text-blue-300">Total Schools</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ validationResult.normalizationStats.negeri.normalized }}</div>
                <div class="text-sm text-green-800 dark:text-green-300">Negeri Normalized</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ validationResult.existingCount }}</div>
                <div class="text-sm text-purple-800 dark:text-purple-300">Will Update</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-gray-600 dark:text-gray-400">{{ validationResult.currentDatabaseTotal }}</div>
                <div class="text-sm text-gray-800 dark:text-gray-300">Current Total</div>
              </div>
            </div>

            <!-- Normalization Preview -->
            <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 class="font-semibold text-gray-900 dark:text-white">Smart Normalization Preview</h3>
              </div>
              <div class="p-4 max-h-64 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="text-left text-gray-500 dark:text-gray-400">
                    <tr>
                      <th class="pb-2">Original</th>
                      <th class="pb-2">→</th>
                      <th class="pb-2">Normalized</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-for="(sample, idx) in validationResult.sample.slice(0, 10)" :key="idx">
                      <td class="py-2 text-gray-600 dark:text-gray-400">
                        <div class="text-xs text-gray-400">Negeri:</div>
                        {{ sample.original_negeri || sample.negeri }}
                        <div class="text-xs text-gray-400 mt-1">Bandar:</div>
                        {{ sample.original_bandar || sample.bandar }}
                      </td>
                      <td class="py-2 text-heritageTeal">→</td>
                      <td class="py-2 font-medium text-gray-900 dark:text-white">
                        <div>{{ sample.negeri }}</div>
                        <div class="text-gray-600 dark:text-gray-400">{{ sample.bandar }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Warnings -->
            <div v-if="validationResult.normalizationStats.negeri.unrecognized > 0" 
                 class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-center gap-2 text-red-800 dark:text-red-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="font-semibold">Warning: {{ validationResult.normalizationStats.negeri.unrecognized }} unrecognized negeri names</span>
              </div>
              <p class="text-sm text-red-700 dark:text-red-300 mt-2">
                These schools will be imported but may not appear in filters correctly.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 3: Processing -->
        <div v-else-if="step === 3" class="text-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-heritageTeal mx-auto mb-4"></div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ importStatus }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ importProgress }}
          </p>
          <div v-if="backupCreating" class="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating database backup...
          </div>
        </div>

        <!-- Step 4: Results -->
        <div v-else-if="step === 4 && importResult" class="space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Import Completed!</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Successfully processed {{ importResult.total }} schools
            </p>
          </div>

          <!-- Results Grid -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ importResult.imported }}</div>
              <div class="text-sm text-green-800 dark:text-green-300">New Schools</div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ importResult.updated }}</div>
              <div class="text-sm text-blue-800 dark:text-blue-300">Updated</div>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <div class="text-3xl font-bold text-red-600 dark:text-red-400">{{ importResult.failed }}</div>
              <div class="text-sm text-red-800 dark:text-red-300">Failed</div>
            </div>
          </div>

          <!-- Backup Info -->
          <div v-if="importResult.backup" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-semibold text-blue-900 dark:text-blue-200">Database Backup Created</h4>
                <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {{ importResult.backup.filename }} • {{ formatFileSize(importResult.backup.size) }}
                </p>
              </div>
              <button 
                @click="downloadBackup(importResult.backup.filename)"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="importResult.errors && importResult.errors.length > 0" 
               class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 class="font-semibold text-red-900 dark:text-red-200 mb-2">Errors ({{ importResult.errors.length }})</h4>
            <ul class="text-sm text-red-700 dark:text-red-300 space-y-1 max-h-32 overflow-y-auto">
              <li v-for="(error, idx) in importResult.errors" :key="idx">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div class="flex justify-between items-center">
          <button 
            v-if="step > 1 && step < 4"
            @click="step--"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button 
              v-if="step === 1 && selectedFile"
              @click="validateData"
              :disabled="validating"
              class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors disabled:opacity-50"
            >
              {{ validating ? 'Analyzing...' : 'Preview & Validate →' }}
            </button>

            <button 
              v-if="step === 2 && validationResult"
              @click="executeImport"
              :disabled="importing"
              class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors disabled:opacity-50"
            >
              {{ importing ? 'Importing...' : 'Execute Import →' }}
            </button>

            <button 
              v-if="step === 4"
              @click="$emit('close')"
              class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'EnhancedSchoolImportModal',
  emits: ['close', 'imported'],
  setup(props, { emit }) {
    const step = ref(1)
    const selectedFile = ref(null)
    const selectedStrategy = ref('merge')
    const validating = ref(false)
    const importing = ref(false)
    const backupCreating = ref(false)
    const importStatus = ref('')
    const importProgress = ref('')
    const validationResult = ref(null)
    const importResult = ref(null)

    const excelColumns = [
      'KODSEKOLAH', 'NAMASEKOLAH', 'NEGERI', 'PPD',
      'PERINGKAT', 'JENIS', 'ALAMATSURAT', 'POSKODSURAT',
      'BANDARSURAT', 'NOTELEFON', 'NOFAX', 'EMAIL',
      'MURID', 'GURU', 'LOKASI'
    ]

    const importStrategies = [
      {
        value: 'merge',
        label: 'Merge with Existing Data',
        description: 'Update existing schools and add new ones. Keeps current data intact.',
        warning: null
      },
      {
        value: 'drop_and_import',
        label: 'Drop & Import (No Backup)',
        description: 'Delete all existing schools and import fresh data.',
        warning: '⚠️ All existing data will be permanently deleted!'
      },
      {
        value: 'backup_and_drop',
        label: 'Backup, Drop & Import',
        description: 'Create SQL backup, then delete all schools and import fresh.',
        warning: 'Recommended: Creates a backup file you can restore later.'
      }
    ]

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
      }
    }

    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        selectedFile.value = file
      }
    }

    const validateData = async () => {
      if (!selectedFile.value) return

      validating.value = true
      step.value = 2

      try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        const response = await axios.post('/api/schools/admin/import/validate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        validationResult.value = response.data.preview
        validating.value = false
      } catch (error) {
        console.error('Validation error:', error)
        alert('Failed to validate data: ' + (error.response?.data?.message || error.message))
        validating.value = false
        step.value = 1
      }
    }

    const executeImport = async () => {
      if (!selectedFile.value) return

      importing.value = true
      step.value = 3
      backupCreating.value = selectedStrategy.value === 'backup_and_drop'
      importStatus.value = 'Processing schools...'
      importProgress.value = 'This may take a few minutes for large datasets'

      try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)
        formData.append('strategy', selectedStrategy.value)

        const response = await axios.post('/api/schools/admin/import/execute', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        importResult.value = response.data
        importing.value = false
        backupCreating.value = false
        step.value = 4
        
        emit('imported', response.data)
      } catch (error) {
        console.error('Import error:', error)
        alert('Import failed: ' + (error.response?.data?.message || error.message))
        importing.value = false
        backupCreating.value = false
        step.value = 2
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
      } catch (error) {
        console.error('Download error:', error)
        alert('Failed to download backup')
      }
    }

    return {
      step,
      selectedFile,
      selectedStrategy,
      validating,
      importing,
      backupCreating,
      importStatus,
      importProgress,
      validationResult,
      importResult,
      excelColumns,
      importStrategies,
      formatFileSize,
      handleFileSelect,
      handleDrop,
      validateData,
      executeImport,
      downloadBackup
    }
  }
}
</script>