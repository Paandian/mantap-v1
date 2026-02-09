<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-heritageTeal"></div>
    </div>

    <div v-else-if="school" class="pb-12">
      <!-- Hero Banner -->
      <div class="relative h-64 md:h-80 bg-gradient-to-r from-heritageTeal to-teal-700">
        <img
          v-if="school.banner_url"
          :src="school.banner_url"
          class="w-full h-full object-cover opacity-50"
          alt="School Banner"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 right-0">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div class="flex flex-col md:flex-row items-end gap-6">
              <!-- School Logo -->
              <div class="flex-shrink-0">
                <img
                  :src="school.logo_url || '/images/school-placeholder.png'"
                  :alt="school.nama_sekolah"
                  class="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg bg-white"
                />
              </div>
              
              <!-- School Title -->
              <div class="flex-1 text-white mb-2">
                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <h1 class="text-2xl md:text-4xl font-bold">{{ school.nama_sekolah }}</h1>
                  <span
                    v-if="school.status_claim === 'CLAIMED'"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white"
                  >
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Verified by School
                  </span>
                </div>
                <p class="text-lg text-teal-100">
                  {{ school.kod_sekolah }} • {{ school.bandar }}, {{ school.negeri }}
                </p>
              </div>

              <!-- Claim Button -->
              <div v-if="school.status_claim === 'UNCLAIMED'" class="flex-shrink-0 mb-4">
                <button
                  @click="showClaimModal = true"
                  class="px-6 py-3 bg-mantapOrange text-white rounded-lg hover:bg-mantapOrange/90 transition-colors font-medium shadow-lg"
                >
                  Claim This School
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Quick Stats -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-heritageTeal">{{ school.jumlah_murid?.toLocaleString() || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-mantapOrange">{{ school.jumlah_guru || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Teachers</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600">{{ school.jenis }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Type</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600">{{ school.peringkat }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Level</div>
                </div>
              </div>
            </div>

            <!-- About -->
            <div v-if="school.description" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ school.description }}</p>
            </div>

            <!-- Vision & Mission -->
            <div v-if="school.visi || school.misi" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div v-if="school.visi" class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Vision</h2>
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <p class="text-blue-900 dark:text-blue-200 italic">"{{ school.visi }}"</p>
                </div>
              </div>
              <div v-if="school.misi">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Mission</h2>
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                  <p class="text-green-900 dark:text-green-200">{{ school.misi }}</p>
                </div>
              </div>
            </div>

            <!-- Facilities -->
            <div v-if="school.facilities" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Facilities</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="(facility, index) in parsedFacilities"
                  :key="index"
                  class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ facility }}
                </div>
              </div>
            </div>

            <!-- Achievements -->
            <div v-if="school.achievements" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Achievements</h2>
              <ul class="space-y-3">
                <li
                  v-for="(achievement, index) in parsedAchievements"
                  :key="index"
                  class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ achievement }}
                </li>
              </ul>
            </div>

            <!-- Gallery -->
            <div v-if="school.gallery && parsedGallery.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gallery</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img
                  v-for="(image, index) in parsedGallery"
                  :key="index"
                  :src="image"
                  class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openGallery(index)"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact Info -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div class="space-y-4">
                <div v-if="school.alamat_surat" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div class="text-gray-700 dark:text-gray-300">
                    {{ school.alamat_surat }}<br>
                    {{ school.poskod }} {{ school.bandar }}
                  </div>
                </div>

                <div v-if="school.no_telefon" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <a :href="`tel:${school.no_telefon}`" class="text-heritageTeal hover:underline">{{ school.no_telefon }}</a>
                </div>

                <div v-if="school.no_faks" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">{{ school.no_faks }}</span>
                </div>

                <div v-if="school.email" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <a :href="`mailto:${school.email}`" class="text-heritageTeal hover:underline">{{ school.email }}</a>
                </div>

                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300 capitalize">{{ school.lokasi }}</span>
                </div>
              </div>

              <!-- Social Links -->
              <div v-if="hasSocialLinks" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Follow Us</h3>
                <div class="flex gap-3">
                  <a v-if="school.website" :href="school.website" target="_blank" class="text-gray-400 hover:text-heritageTeal transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </a>
                  <a v-if="school.facebook" :href="school.facebook" target="_blank" class="text-gray-400 hover:text-blue-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- School Officials -->
            <div v-if="school.officials && school.officials.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">School Officials</h2>
              <div class="space-y-4">
                <div
                  v-for="official in school.officials"
                  :key="official.id"
                  class="flex items-center gap-4"
                >
                  <img
                    :src="official.gambar_url || '/images/avatar-placeholder.png'"
                    :alt="official.nama"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ official.nama }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ official.jawatan }}</div>
                    <div v-if="official.is_primary_contact" class="text-xs text-green-600 font-medium">
                      Primary Contact
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map -->
            <div v-if="school.koordinat_x && school.koordinat_y" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
              <div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <a
                  :href="`https://www.google.com/maps?q=${school.koordinat_y},${school.koordinat_x}`"
                  target="_blank"
                  class="text-center"
                >
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-heritageTeal hover:underline text-sm">View on Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen">
      <svg class="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">School Not Found</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The school you're looking for doesn't exist.</p>
      <router-link
        to="/schools"
        class="px-6 py-3 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors"
      >
        Browse Schools
      </router-link>
    </div>

    <!-- Claim Modal -->
    <SchoolClaimModal
      v-if="showClaimModal"
      :school="school"
      @close="showClaimModal = false"
      @submitted="handleClaimSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/schools'
import SchoolClaimModal from '@/components/schools/SchoolClaimModal.vue'

const route = useRoute()
const schoolStore = useSchoolStore()

const loading = ref(true)
const school = ref(null)
const showClaimModal = ref(false)

// Computed
const parsedFacilities = computed(() => {
  if (!school.value?.facilities) return []
  try {
    return JSON.parse(school.value.facilities)
  } catch {
    return []
  }
})

const parsedAchievements = computed(() => {
  if (!school.value?.achievements) return []
  try {
    return JSON.parse(school.value.achievements)
  } catch {
    return []
  }
})

const parsedGallery = computed(() => {
  if (!school.value?.gallery) return []
  try {
    return JSON.parse(school.value.gallery)
  } catch {
    return []
  }
})

const hasSocialLinks = computed(() => {
  return school.value?.website || school.value?.facebook || school.value?.instagram || school.value?.youtube
})

onMounted(async () => {
  const schoolId = route.params.id
  try {
    school.value = await schoolStore.fetchSchoolById(schoolId)
  } catch (error) {
    console.error('Error loading school:', error)
  } finally {
    loading.value = false
  }
})

const handleClaimSubmitted = () => {
  showClaimModal.value = false
  // Refresh school data
  schoolStore.fetchSchoolById(route.params.id).then(data => {
    school.value = data
  })
}

const openGallery = (index) => {
  // Implement lightbox here
  console.log('Open gallery at index:', index)
}
</script>
