<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-heritageTeal"></div>
    </div>

    <div v-else-if="school" class="pb-12">
      <!-- Hero Section with Banner -->
      <div class="relative">
        <!-- Banner Image -->
        <div class="h-[400px] md:h-[500px] relative overflow-hidden">
          <img
            :src="school.banner_url || '/images/school-banner-placeholder.png'"
            class="w-full h-full object-cover"
            alt="School Banner"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
        </div>

        <!-- School Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row items-end gap-6">
              <!-- School Logo -->
              <div class="flex-shrink-0 relative group">
                <div class="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white">
                  <img
                    :src="school.logo_url || '/images/school-placeholder.svg'"
                    :alt="school.nama_sekolah"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Verified Badge -->
                <div
                  v-if="school.status_claim === 'CLAIMED'"
                  class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>

              <!-- School Title & Quick Info -->
              <div class="flex-1 mb-4 md:mb-8">
                <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 class="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ school.nama_sekolah }}
                      </h1>
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-heritageTeal/10 text-heritageTeal border border-heritageTeal/20">
                          {{ school.jenis }}
                        </span>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {{ school.peringkat }}
                        </span>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {{ school.lokasi }}
                        </span>
                      </div>
                      <p class="text-gray-600 dark:text-gray-300 text-sm">
                        {{ school.kod_sekolah }} • {{ school.bandar }}, {{ school.negeri }}
                      </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-2">
                      <button
                        @click="downloadSchoolProfile"
                        :disabled="generatingPDF"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-heritageTeal hover:bg-heritageTeal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritageTeal disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg v-if="generatingPDF" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Download Profile (PDF)
                      </button>

                      <button
                        v-if="school.status_claim !== 'CLAIMED'"
                        @click="showClaimModal = true"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritageTeal"
                      >
                        <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Claim This School
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Statistics Cards -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">School Overview</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-3xl font-bold text-heritageTeal mb-1">
                    {{ school.jumlah_murid?.toLocaleString() || 0 }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600 mb-1">
                    {{ school.jumlah_guru || 0 }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Teachers</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600 mb-1">
                    {{ school.jenis }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Type</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-1">
                    {{ school.peringkat }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Level</div>
                </div>
              </div>
            </div>

            <!-- About Our School -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <div class="flex items-center justify-between mb-6">
                 <h2 class="text-xl font-bold text-gray-900 dark:text-white">About Our School</h2>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- About Content -->
                 <div>
                   <div v-if="school.description" class="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 mb-4">
                     <p>{{ school.description }}</p>
                   </div>

                   <!-- Generic About Content -->
                   <div class="space-y-4">
                     <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Why Choose Our School?</h3>
                     <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                       Our school provides a nurturing environment where students can excel academically while developing essential life skills. We focus on holistic education that encompasses intellectual growth, character development, and community involvement.
                     </p>
                     <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                       With dedicated teachers and modern facilities, we prepare our students to become responsible citizens and lifelong learners in an ever-changing world.
                     </p>
                   </div>
                 </div>

                <!-- About Image -->
                <div class="flex justify-center">
                  <div class="w-full max-w-sm h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      :src="school.about_image_url || '/images/about-school-placeholder.png'"
                      :alt="`About ${school.nama_sekolah}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Vision & Mission -->
            <div v-if="school.visi || school.misi" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Vision & Mission</h2>
              <div class="space-y-6">
                <div v-if="school.visi" class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-6 border-l-4 border-teal-500">
                  <h3 class="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3">Our Vision</h3>
                  <p class="text-teal-700 dark:text-teal-300 italic text-lg">"{{ school.visi }}"</p>
                </div>
                <div v-if="school.misi" class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Our Mission</h3>
                  <p class="text-blue-700 dark:text-blue-300">{{ school.misi }}</p>
                </div>
              </div>
            </div>

            <!-- Events Section -->
            <div id="events-section" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">School Events & Activities</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="event in parsedEvents" :key="event.title" class="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
                  <div class="flex flex-col h-full">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{{ event.title }}</h3>
                        <p v-if="event.date" class="text-xs text-orange-600 mt-1">{{ formatDate(event.date) }}</p>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 flex-1 line-clamp-3">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact Information -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div class="space-y-4">
                <div v-if="school.alamat_surat" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div class="font-medium text-gray-900 dark:text-white">Address</div>
                    <div>{{ school.alamat_surat }}</div>
                    <div>{{ school.poskod }} {{ school.bandar }}, {{ school.negeri }}</div>
                  </div>
                </div>

                <div v-if="school.no_telefon" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div class="font-medium text-gray-900 dark:text-white">Phone</div>
                    <a :href="`tel:${school.no_telefon}`" class="text-heritageTeal hover:underline">{{ school.no_telefon }}</a>
                  </div>
                </div>

                <div v-if="school.email" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div class="font-medium text-gray-900 dark:text-white">Email</div>
                    <a :href="`mailto:${school.email}`" class="text-heritageTeal hover:underline">{{ school.email }}</a>
                  </div>
                </div>

                <div v-if="school.no_faks" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div class="font-medium text-gray-900 dark:text-white">Fax</div>
                    <div>{{ school.no_faks }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- School Location -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">School Location</h3>
              <div class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <iframe
                  v-if="school.koordinat_y && school.koordinat_x"
                  :src="`https://maps.google.com/maps?q=${school.koordinat_y},${school.koordinat_x}&output=embed`"
                  class="w-full h-full border-0"
                  allowfullscreen=""
                  loading="lazy"
                ></iframe>
                <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </div>
              </div>
              <div v-if="school.koordinat_y && school.koordinat_x" class="mt-3">
                <a
                  :href="`https://www.google.com/maps?q=${school.koordinat_y},${school.koordinat_x}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-sm text-heritageTeal hover:text-heritageTeal/80 font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.912-2.709C4.27 10.509 4 9.506 4 8.5 4 5.462 6.462 3 9.5 3c1.006 0 2.009.27 2.791.788"/>
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">School Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The school you're looking for doesn't exist or has been removed.</p>
      <router-link
        to="/schools"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-heritageTeal hover:bg-heritageTeal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritageTeal"
      >
        <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Schools
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

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/schools'
import SchoolClaimModal from '@/components/schools/SchoolClaimModal.vue'

export default {
  name: 'SchoolDetail',
  components: {
    SchoolClaimModal
  },
  setup() {
    const route = useRoute()
    const schoolStore = useSchoolStore()

    const loading = ref(true)
    const school = ref(null)
    const showClaimModal = ref(false)
    const generatingPDF = ref(false)

    // Dummy events data for demonstration
    const dummyEvents = [
      {
        title: 'Annual Sports Day',
        description: 'Join us for our exciting Annual Sports Day featuring various athletic competitions and team spirit building activities for all students.',
        date: '2024-12-15'
      },
      {
        title: 'Science Fair & Exhibition',
        description: 'Showcase your innovative projects and explore the fascinating world of science with interactive exhibits and demonstrations.',
        date: '2024-11-20'
      },
      {
        title: 'Cultural Performance Night',
        description: 'Celebrate our rich cultural heritage with traditional dances, music performances, and cultural showcases from around Malaysia.',
        date: '2024-10-30'
      }
    ]

    const parsedEvents = computed(() => {
      // Return dummy events if no real events exist
      return dummyEvents
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // eslint-disable-next-line no-unused-vars
    const downloadSchoolProfile = async () => {
      // Professional single-page A4 PDF generation
      if (!school.value) return

      generatingPDF.value = true

      try {
        // Create a compact HTML page for single A4 page printing
        const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${school.value.nama_sekolah} - School Profile</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      color: #333;
      background: #fff;
      font-size: 12px;
    }

    .page {
      width: 794px;
      height: 1123px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
      position: relative;
    }

    .hero-section {
      position: relative;
      height: 180px;
      overflow: hidden;
      margin-bottom: 15px;
      border-radius: 8px;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
    }

    .hero-content {
      position: absolute;
      bottom: 15px;
      left: 20px;
      right: 20px;
      color: white;
      z-index: 2;
    }

    .school-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    }

    .school-subtitle {
      font-size: 12px;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    }

    .content-grid {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 15px;
    }

    .stat-card {
      background: white;
      color: #0d9488;
      padding: 12px 8px;
      border-radius: 6px;
      border: 2px solid #0d9488;
      text-align: center;
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
    }

    .stat-value {
      font-size: 18px;
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }

    .stat-label {
      font-size: 10px;
      opacity: 0.9;
    }

    .about-section {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .about-title {
      font-size: 14px;
      font-weight: bold;
      color: #0d9488;
      margin-bottom: 8px;
    }

    .about-content p {
      font-size: 11px;
      line-height: 1.4;
      margin-bottom: 8px;
      color: #475569;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 10px;
    }

    .highlight-card {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      padding: 8px;
      border-radius: 4px;
      border-left: 3px solid #f59e0b;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .highlight-icon {
      font-size: 16px;
      width: 24px;
      text-align: center;
    }

    .highlight-content .value {
      font-size: 12px;
      font-weight: bold;
      color: #92400e;
      display: block;
    }

    .highlight-content .label {
      font-size: 9px;
      color: #78350f;
      font-weight: 600;
    }

    .vision-mission-section {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #0ea5e9;
      margin-bottom: 15px;
    }

    .vision-mission-title {
      font-size: 14px;
      font-weight: bold;
      color: #0c4a6e;
      margin-bottom: 8px;
    }

    .vision-quote {
      font-style: italic;
      font-size: 12px;
      color: #0d9488;
      margin-bottom: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #0d9488;
    }

    .mission-text {
      font-size: 11px;
      line-height: 1.4;
      color: #0369a1;
    }

    .events-section {
      background: linear-gradient(135deg, #fed7aa, #fdba74);
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #f97316;
    }

    .events-title {
      font-size: 14px;
      font-weight: bold;
      color: #92400e;
      margin-bottom: 8px;
    }

    .events-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .event-item {
      background: rgba(255, 255, 255, 0.8);
      padding: 6px;
      border-radius: 4px;
      border-left: 2px solid #ea580c;
    }

    .event-title {
      font-size: 11px;
      font-weight: bold;
      color: #92400e;
      margin-bottom: 2px;
    }

    .event-date {
      font-size: 9px;
      color: #ea580c;
      background: rgba(234, 88, 12, 0.1);
      padding: 2px 6px;
      border-radius: 10px;
      display: inline-block;
      margin-bottom: 3px;
    }

    .event-description {
      font-size: 10px;
      color: #9a3412;
      line-height: 1.3;
    }

    .contact-section {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #0ea5e9;
    }

    .contact-title {
      font-size: 14px;
      font-weight: bold;
      color: #0c4a6e;
      margin-bottom: 8px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .contact-icon {
      width: 24px;
      height: 24px;
      background: #0ea5e9;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      flex-shrink: 0;
    }

    .contact-details h4 {
      margin: 0 0 2px 0;
      font-size: 11px;
      color: #0c4a6e;
      font-weight: 600;
    }

    .contact-details p {
      margin: 0;
      color: #0369a1;
      font-size: 10px;
      line-height: 1.3;
    }

    .footer {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      text-align: center;
      color: #666;
      font-size: 9px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }

    @media print {
      body { margin: 0; }
      .page { width: 100%; height: 100vh; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Hero Section with Banner -->
    <div class="hero-section">
      <img src="${school.value.banner_url || '/images/school-banner-placeholder.png'}" alt="School Banner" class="hero-image" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="school-title">${school.value.nama_sekolah}</h1>
        <p class="school-subtitle">${school.value.kod_sekolah} • ${school.value.bandar}, ${school.value.negeri}</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">${school.value.jumlah_murid?.toLocaleString() || 0}</span>
        <span class="stat-label">Students</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${school.value.jumlah_guru || 0}</span>
        <span class="stat-label">Teachers</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${school.value.jenis}</span>
        <span class="stat-label">Type</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${school.value.peringkat}</span>
        <span class="stat-label">Level</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- About Our School -->
      <div class="about-section">
        <h3 class="about-title">About Our School</h3>
        <div class="about-content">
          ${school.value.description ? `<p>${school.value.description.replace(/\n/g, '<br>')}</p>` : ''}
          <p>Our school provides a nurturing environment where students can excel academically while developing essential life skills. We focus on holistic education that encompasses intellectual growth, character development, and community involvement.</p>
          <p>With dedicated teachers and modern facilities, we prepare our students to become responsible citizens and lifelong learners in an ever-changing world.</p>

          <!-- School Highlights -->
          <div class="highlights-grid">
            <div class="highlight-card">
              <div class="highlight-icon">👥</div>
              <div class="highlight-content">
                <div class="value">${school.value.jumlah_murid?.toLocaleString() || 0}</div>
                <div class="label">Total Students</div>
              </div>
            </div>
            <div class="highlight-card">
              <div class="highlight-icon">👨‍🏫</div>
              <div class="highlight-content">
                <div class="value">${school.value.jumlah_guru || 0}</div>
                <div class="label">Teaching Staff</div>
              </div>
            </div>
            <div class="highlight-card">
              <div class="highlight-icon">🏫</div>
              <div class="highlight-content">
                <div class="value">${school.value.jenis}</div>
                <div class="label">School Type</div>
              </div>
            </div>
            <div class="highlight-card">
              <div class="highlight-icon">📍</div>
              <div class="highlight-content">
                <div class="value">${school.value.lokasi}</div>
                <div class="label">Location</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vision & Mission -->
      ${(school.value.visi || school.value.misi) ? `
      <div class="vision-mission-section">
        <h3 class="vision-mission-title">Vision & Mission</h3>
        ${school.value.visi ? `<div class="vision-quote">"${school.value.visi}"</div>` : ''}
        ${school.value.misi ? `<div class="mission-text">${school.value.misi.replace(/\n/g, '<br>')}</div>` : ''}
      </div>
      ` : ''}

      <!-- Events Section -->
      <div class="events-section">
        <h3 class="events-title">School Events & Activities</h3>
        <div class="events-list">
          ${parsedEvents.value.slice(0, 3).map(event => `
            <div class="event-item">
              <div class="event-title">${event.title}</div>
              ${event.date ? `<div class="event-date">${formatDate(event.date)}</div>` : ''}
              <div class="event-description">${event.description.substring(0, 80)}${event.description.length > 80 ? '...' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Contact Information -->
      <div class="contact-section">
        <h3 class="contact-title">Contact Information</h3>
        <div class="contact-grid">
          ${school.value.alamat_surat ? `
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h4>Address</h4>
              <p>${school.value.alamat_surat}<br>${school.value.poskod} ${school.value.bandar}, ${school.value.negeri}</p>
            </div>
          </div>
          ` : ''}
          ${school.value.no_telefon ? `
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div class="contact-details">
              <h4>Phone</h4>
              <p>${school.value.no_telefon}</p>
            </div>
          </div>
          ` : ''}
          ${school.value.email ? `
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div class="contact-details">
              <h4>Email</h4>
              <p>${school.value.email}</p>
            </div>
          </div>
          ` : ''}
          ${school.value.no_faks ? `
          <div class="contact-item">
            <div class="contact-icon">📠</div>
            <div class="contact-details">
              <h4>Fax</h4>
              <p>${school.value.no_faks}</p>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Generated from Mantap.work School Directory</p>
      <p>© ${new Date().getFullYear()} ${school.value.nama_sekolah}</p>
    </div>
  </div>
</body>
</html>`

        const printWindow = window.open('', '_blank')
        printWindow.document.write(printContent)
        printWindow.document.close()

        // Wait a bit then print
        setTimeout(() => {
          printWindow.print()
        }, 500)

      } catch (error) {
        alert('Error generating PDF. Please try again.')
      } finally {
        generatingPDF.value = false
      }
    }

    const handleClaimSubmitted = () => {
      showClaimModal.value = false
      // Refresh school data
      schoolStore.fetchSchoolById(route.params.id).then(data => {
        school.value = data
      })
    }

    onMounted(async () => {
      const schoolId = route.params.id
      try {
        school.value = await schoolStore.fetchSchoolById(schoolId)
      } catch (error) {
        // Error handled silently
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      school,
      showClaimModal,
      generatingPDF,
      parsedEvents,
      formatDate,
      downloadSchoolProfile,
      handleClaimSubmitted
    }
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1rem;
}
</style>