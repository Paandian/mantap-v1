<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Claim This School
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Success State -->
        <div v-if="submitted" class="text-center py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg class="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Claim Submitted!
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Your claim request has been submitted for review. You'll be notified once it's approved.
          </p>
          <button
            @click="$emit('submitted')"
            class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors"
          >
            Done
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- School Info -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-center gap-4">
              <img
                :src="school.logo_url || '/images/school-placeholder.svg'"
                :alt="school.nama_sekolah"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ school.nama_sekolah }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ school.kod_sekolah }}</p>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <p class="mb-2">To claim this school, please provide:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Your full name as registered with the school</li>
              <li>Your official position</li>
              <li>A valid school email address</li>
              <li>Contact phone number</li>
            </ul>
          </div>

          <!-- Form Fields -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., AHMAD BIN ISMAIL"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.position"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Position</option>
              <option value="Headmaster">Headmaster / Principal</option>
              <option value="Senior Assistant">Senior Assistant</option>
              <option value="Teacher">Teacher</option>
              <option value="Administrative Staff">Administrative Staff</option>
              <option value="PTA Member">PTA Member</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="your.name@moe.edu.my"
            />
            <p class="mt-1 text-xs text-gray-500">
              Using your official school email will speed up verification
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 0123456789"
            />
          </div>

          <!-- Document Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Document <span class="text-gray-400">(Optional)</span>
            </label>
            <div
              @click="$refs.fileInput.click()"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-heritageTeal dark:hover:border-heritageTeal transition-colors cursor-pointer"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                class="hidden"
                @change="handleFileSelect"
              />
              <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ selectedFile ? selectedFile.name : 'Upload staff ID or authorization letter' }}
              </p>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-heritageTeal focus:ring-heritageTeal border-gray-300 rounded"
            />
            <label class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I confirm that I am an authorized representative of this school and the information provided is accurate.
            </label>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div v-if="!submitted" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="isSubmitting || !form.agreeToTerms"
          class="px-6 py-2 bg-mantapOrange text-white rounded-lg hover:bg-mantapOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="isSubmitting" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Submit Claim
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSchoolStore } from '@/stores/schools'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  school: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submitted'])

const schoolStore = useSchoolStore()
const authStore = useAuthStore()

const form = ref({
  fullName: authStore.user?.name || '',
  position: '',
  email: authStore.user?.email || '',
  phone: '',
  agreeToTerms: false
})

const selectedFile = ref(null)
const isSubmitting = ref(false)
const submitted = ref(false)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }
    selectedFile.value = file
  }
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    alert('Please log in to claim a school')
    return
  }

  isSubmitting.value = true

  try {
    const claimData = {
      fullName: form.value.fullName,
      position: form.value.position,
      email: form.value.email,
      phone: form.value.phone
    }

    await schoolStore.submitClaim(props.school.id, claimData)
    submitted.value = true
  } catch (error) {
    alert(error.message || 'Failed to submit claim')
  } finally {
    isSubmitting.value = false
  }
}
</script>
