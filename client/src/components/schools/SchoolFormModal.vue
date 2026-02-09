<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit School' : 'Add New School' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nama_sekolah"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., SEKOLAH KEBANGSAAN TAMAN MELAWATI"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.kod_sekolah"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., WBA0001"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State (Negeri) <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.negeri"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select State</option>
                <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education Level <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.peringkat"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Level</option>
                <option value="Rendah">Primary (Rendah)</option>
                <option value="Menengah">Secondary (Menengah)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Type <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.jenis"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Type</option>
                <option v-for="type in schoolTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PPD (District Office)
              </label>
              <input
                v-model="form.ppd"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., PPD GOMBAK"
              />
            </div>
          </div>

          <!-- Address Information -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mailing Address
                </label>
                <textarea
                  v-model="form.alamat_surat"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Full address..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postcode
                </label>
                <input
                  v-model="form.poskod"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 53100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City/Bandar
                </label>
                <input
                  v-model="form.bandar"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., KUALA LUMPUR"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location Type
                </label>
                <select
                  v-model="form.lokasi"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Bandar">Urban (Bandar)</option>
                  <option value="Luar Bandar">Rural (Luar Bandar)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  v-model="form.no_telefon"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 0341026128"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fax Number
                </label>
                <input
                  v-model="form.no_faks"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 0341026129"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., school@moe.edu.my"
                />
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">School Statistics</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Students
                </label>
                <input
                  v-model.number="form.jumlah_murid"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Teachers
                </label>
                <input
                  v-model.number="form.jumlah_guru"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Government Assistance
                </label>
                <select
                  v-model="form.bantuan"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">None</option>
                  <option value="SK.1">SK.1</option>
                  <option value="SK.2">SK.2</option>
                  <option value="SM.1">SM.1</option>
                  <option value="SM.2">SM.2</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preschool
                </label>
                <select
                  v-model="form.prasekolah"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="TIADA">No (TIADA)</option>
                  <option value="ADA">Yes (ADA)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Integration Program
                </label>
                <select
                  v-model="form.integrasi"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="TIADA">No (TIADA)</option>
                  <option value="ADA">Yes (ADA)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Coordinates -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Location Coordinates</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Longitude (X)
                </label>
                <input
                  v-model="form.koordinat_x"
                  type="number"
                  step="any"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 101.6542"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Latitude (Y)
                </label>
                <input
                  v-model="form.koordinat_y"
                  type="number"
                  step="any"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 3.2156"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
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
          :disabled="isSubmitting"
          class="px-6 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="isSubmitting" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ isEditing ? 'Update School' : 'Create School' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  school: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.school)
const isSubmitting = ref(false)

// Malaysian states
const states = [
  'JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI SEMBILAN',
  'PAHANG', 'PERAK', 'PERLIS', 'PULAU PINANG', 'SABAH',
  'SARAWAK', 'SELANGOR', 'TERENGGANU',
  'WILAYAH PERSEKUTUAN KUALA LUMPUR',
  'WILAYAH PERSEKUTUAN LABUAN',
  'WILAYAH PERSEKUTUAN PUTRAJAYA'
]

// School types
const schoolTypes = [
  'SK', 'SK KHAS', 'K9', 'SJKC', 'SJKT', 'SR SABK',
  'SMK', 'KT6', 'SBP', 'SENI', 'MODEL KHAS', 'SM SABK',
  'KV', 'SMKA', 'SM KHAS', 'SUKAN', 'SMT', 'SBJK'
]

// Form data
const form = ref({
  kod_sekolah: props.school?.kod_sekolah || '',
  nama_sekolah: props.school?.nama_sekolah || '',
  negeri: props.school?.negeri || '',
  peringkat: props.school?.peringkat || '',
  jenis: props.school?.jenis || '',
  ppd: props.school?.ppd || '',
  alamat_surat: props.school?.alamat_surat || '',
  poskod: props.school?.poskod || '',
  bandar: props.school?.bandar || '',
  no_telefon: props.school?.no_telefon || '',
  no_faks: props.school?.no_faks || '',
  email: props.school?.email || '',
  lokasi: props.school?.lokasi || 'Bandar',
  jumlah_murid: props.school?.jumlah_murid || 0,
  jumlah_guru: props.school?.jumlah_guru || 0,
  prasekolah: props.school?.prasekolah || 'TIADA',
  integrasi: props.school?.integrasi || 'TIADA',
  bantuan: props.school?.bantuan || '',
  koordinat_x: props.school?.koordinat_x || '',
  koordinat_y: props.school?.koordinat_y || ''
})

const handleSubmit = () => {
  isSubmitting.value = true
  emit('save', { ...form.value })
  isSubmitting.value = false
}
</script>
